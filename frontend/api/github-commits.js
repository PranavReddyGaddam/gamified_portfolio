/**
 * @typedef {import('@vercel/node').VercelRequest} VercelRequest
 * @typedef {import('@vercel/node').VercelResponse} VercelResponse
 */

/**
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 */
async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const username = (req.query.username || 'PranavReddyGaddam');
  
  // Note: GitHub token is optional but recommended for higher rate limits
  // Without token: 60 requests/hour per IP
  // With token: 5,000 requests/hour

  try {
    // Early return if fetch is not available (shouldn't happen on Node 18+)
    if (typeof fetch === 'undefined') {
      throw new Error('Fetch API not available - Node.js version may be too old');
    }

    // Step 1: Fetch repositories
    const headers = {
      Accept: 'application/vnd.github.v3+json',
    };
    
    // Only add Authorization header if token is available
    if (githubToken) {
      headers.Authorization = `token ${githubToken}`;
    }

    // Fetch repositories (simplified - use public endpoint to avoid auth issues)
    let allRepos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 3) { // Limit to 3 pages to avoid timeout
      try {
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
          { headers }
        );

        if (!reposResponse.ok) {
          if (reposResponse.status === 404) {
            throw new Error(`User ${username} not found`);
          }
          if (reposResponse.status === 403) {
            console.warn('Rate limit hit or access denied');
            // Continue with empty repos rather than failing
            hasMore = false;
            break;
          }
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }

        const repos = await reposResponse.json();
        if (!Array.isArray(repos)) {
          throw new Error('Invalid response format from GitHub API');
        }

        if (repos.length === 0) {
          hasMore = false;
        } else {
          allRepos = allRepos.concat(repos);
          page++;
          if (repos.length < 100) {
            hasMore = false;
          }
        }
      } catch (error) {
        console.error(`Error fetching repos page ${page}:`, error);
        hasMore = false;
        // Continue with repos we've fetched so far
      }
    }

    if (allRepos.length === 0) {
      console.warn('No repositories found');
      return res.status(200).json([]);
    }

    console.log(`Found ${allRepos.length} repositories`);

    // Limit to first 10 repos to avoid timeout (Vercel has 10s timeout on hobby plan)
    const reposToProcess = allRepos.slice(0, 10);
    console.log(`Processing ${reposToProcess.length} repositories (limited to avoid timeout)`);

    // Step 2: Fetch commits from repositories with pagination
    const commitPromises = reposToProcess.map(async (repo) => {
      try {
        const repoName = repo.full_name || `${repo.owner.login}/${repo.name}`;
        let allCommits = [];
        let commitPage = 1;
        let hasMoreCommits = true;

        // Fetch commits with pagination (limit to first 3 pages = 300 commits per repo to avoid timeout)
        while (hasMoreCommits && commitPage <= 3) {
          const commitHeaders = {
            Accept: 'application/vnd.github.v3+json',
          };
          
          if (githubToken) {
            commitHeaders.Authorization = `token ${githubToken}`;
          }
          
          const response = await fetch(
            `https://api.github.com/repos/${repoName}/commits?per_page=100&page=${commitPage}&author=${username}`,
            { headers: commitHeaders }
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

        return allCommits.map((commit) => ({
          date: commit.commit.author.date.split('T')[0], // Extract YYYY-MM-DD
        }));
      } catch (error) {
        console.error(`Error fetching commits for ${repo.full_name || repo.name}:`, error);
        return []; // Return empty array if repo fails
      }
    });

    // Wait for all commits with timeout protection
    const allCommits = await Promise.allSettled(commitPromises);
    const successfulCommits = allCommits
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .flat()
      .flat();
    
    const flattenedCommits = successfulCommits;

    // Aggregate commits by date
    const commitMap = new Map();
    flattenedCommits.forEach((commit) => {
      const count = commitMap.get(commit.date) || 0;
      commitMap.set(commit.date, count + 1);
    });

    // Convert to array and sort by date
    const commitData = Array.from(commitMap.entries())
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Full error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return res.status(500).json({ 
      error: 'Failed to fetch commit history',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    });
  }
}

module.exports = handler;

