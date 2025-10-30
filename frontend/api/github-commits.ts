import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CommitData {
  date: string;
  count: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const username = req.query.username as string || 'PranavReddyGaddam';
  
  if (!githubToken) {
    return res.status(500).json({ 
      error: 'GitHub token is required',
      message: 'GITHUB_TOKEN environment variable is not set'
    });
  }

  try {
    // Step 1: Fetch ALL repositories for the user
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${githubToken}`,
    };

    // Fetch all repositories (including private ones if accessible)
    let allRepos: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const reposResponse = await fetch(
        `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator`,
        { headers }
      );

      if (!reposResponse.ok) {
        // Fallback to public repos if user/repos fails
        if (reposResponse.status === 404 || reposResponse.status === 403) {
          const publicReposResponse = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
            { headers }
          );
          if (!publicReposResponse.ok) {
            throw new Error(`GitHub API error: ${publicReposResponse.status}`);
          }
          const publicRepos = await publicReposResponse.json();
          if (publicRepos.length === 0) {
            hasMore = false;
          } else {
            allRepos = allRepos.concat(publicRepos);
            page++;
          }
        } else {
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }
      } else {
        const repos = await reposResponse.json();
        if (repos.length === 0) {
          hasMore = false;
        } else {
          allRepos = allRepos.concat(repos);
          page++;
          // GitHub API limits to 100 repos per page, so if we get less than 100, we're done
          if (repos.length < 100) {
            hasMore = false;
          }
        }
      }
    }

    console.log(`Found ${allRepos.length} repositories`);

    // Step 2: Fetch commits from all repositories with pagination
    const commitPromises = allRepos.map(async (repo) => {
      try {
        const repoName = repo.full_name || `${repo.owner.login}/${repo.name}`;
        let allCommits: any[] = [];
        let commitPage = 1;
        let hasMoreCommits = true;

        // Fetch all commits with pagination
        while (hasMoreCommits) {
          const response = await fetch(
            `https://api.github.com/repos/${repoName}/commits?per_page=100&page=${commitPage}&author=${username}`,
            { headers }
          );

          if (!response.ok) {
            // If repo doesn't exist, can't access, or is empty, skip it
            if (response.status === 404 || response.status === 403 || response.status === 409) {
              hasMoreCommits = false;
              return [];
            }
            // Handle rate limiting
            if (response.status === 403) {
              console.warn(`Rate limit hit for ${repoName}, skipping`);
              hasMoreCommits = false;
              return [];
            }
            // For other errors, skip this repo
            console.warn(`Skipping ${repoName}: HTTP ${response.status}`);
            hasMoreCommits = false;
            return [];
          }

          const commits = await response.json();
          if (commits.length === 0) {
            hasMoreCommits = false;
          } else {
            allCommits = allCommits.concat(commits);
            commitPage++;
            // If we got less than 100 commits, we're done with this repo
            if (commits.length < 100) {
              hasMoreCommits = false;
            }
          }
        }

        return allCommits.map((commit: any) => ({
          date: commit.commit.author.date.split('T')[0], // Extract YYYY-MM-DD
        }));
      } catch (error) {
        console.error(`Error fetching commits for ${repo.full_name || repo.name}:`, error);
        return []; // Return empty array if repo fails
      }
    });

    const allCommits = await Promise.all(commitPromises);
    const flattenedCommits = allCommits.flat();

    // Aggregate commits by date
    const commitMap = new Map<string, number>();
    flattenedCommits.forEach((commit) => {
      const count = commitMap.get(commit.date) || 0;
      commitMap.set(commit.date, count + 1);
    });

    // Convert to array and sort by date
    const commitData: CommitData[] = Array.from(commitMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Return last 365 days of data
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const filteredData = commitData.filter(
      (item) => new Date(item.date) >= oneYearAgo
    );

    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(filteredData);
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch commit history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
