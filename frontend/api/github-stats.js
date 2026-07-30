/**
 * @typedef {import('@vercel/node').VercelRequest} VercelRequest
 * @typedef {import('@vercel/node').VercelResponse} VercelResponse
 */

const STATS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      followers { totalCount }
      pullRequests { totalCount }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Walk the calendar backwards to find the current streak, and forwards for the
 * longest one. Today counts as neutral rather than breaking the streak, since
 * the day is still in progress.
 *
 * @param {{ date: string, count: number }[]} days chronologically sorted
 */
function calculateStreaks(days) {
  let longest = 0;
  let running = 0;

  days.forEach((day) => {
    if (day.count > 0) {
      running++;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  });

  const today = new Date().toISOString().split('T')[0];
  let current = 0;

  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.date > today) continue;
    if (day.count > 0) {
      current++;
    } else if (day.date === today) {
      continue; // today isn't over yet
    } else {
      break;
    }
  }

  return { current, longest };
}

/**
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 */
async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const username = req.query.username || 'PranavReddyGaddam';

  // Unlike the REST endpoints, GraphQL always requires authentication.
  if (!githubToken) {
    return res.status(500).json({
      error: 'Failed to fetch GitHub stats',
      message: 'GITHUB_TOKEN is not configured',
    });
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: STATS_QUERY,
        variables: { login: username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL error: ${response.status}`);
    }

    const payload = await response.json();

    if (payload.errors && payload.errors.length > 0) {
      throw new Error(payload.errors[0].message || 'GraphQL query failed');
    }

    const user = payload.data && payload.data.user;
    if (!user) {
      return res.status(404).json({
        error: 'Failed to fetch GitHub stats',
        message: `User ${username} not found`,
      });
    }

    const contributions = user.contributionsCollection;
    const calendar = contributions.contributionCalendar;

    const days = calendar.weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => ({ date: day.date, count: day.contributionCount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const streaks = calculateStreaks(days);

    // Sum language bytes across every non-fork repo the user owns.
    const languageBytes = new Map();
    user.repositories.nodes.forEach((repo) => {
      repo.languages.edges.forEach((edge) => {
        const existing = languageBytes.get(edge.node.name);
        languageBytes.set(edge.node.name, {
          size: (existing ? existing.size : 0) + edge.size,
          color: edge.node.color,
        });
      });
    });

    const totalBytes = Array.from(languageBytes.values()).reduce(
      (sum, lang) => sum + lang.size,
      0
    );

    const languages = Array.from(languageBytes.entries())
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 5)
      .map(([name, lang]) => ({
        name,
        color: lang.color,
        percent: totalBytes > 0 ? (lang.size / totalBytes) * 100 : 0,
      }));

    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({
      days,
      totalContributions: calendar.totalContributions,
      activeDays: days.filter((day) => day.count > 0).length,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      pullRequests: user.pullRequests.totalCount,
      followers: user.followers.totalCount,
      languages,
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to fetch GitHub stats',
      message,
    });
  }
}

module.exports = handler;
