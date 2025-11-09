import { useState, useEffect } from 'react';
import { getUserRepos, getUserEvents, getRepoLanguages, getRepoContributors } from './services/githubService';
import { Moon, Sun, Search, Star, GitFork, Eye, Users, Code, Activity } from 'lucide-react';
import { cn } from './utils/cn';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function App() {
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aggregatedLanguages, setAggregatedLanguages] = useState({});
  const [topContributors, setTopContributors] = useState([]);
  const username = 'josephpipitone';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [repoData, eventData] = await Promise.all([
          getUserRepos(username, ''),
          getUserEvents(username, '')
        ]);
        setRepos(repoData);
        setEvents(eventData.slice(0, 10)); // Top 10 recent events

        // Aggregate languages from first 5 repos to avoid rate limits
        const languages = {};
        for (const repo of repoData.slice(0, 5)) {
          try {
            const langData = await getRepoLanguages(username, repo.name, '');
            Object.entries(langData).forEach(([lang, bytes]) => {
              languages[lang] = (languages[lang] || 0) + bytes;
            });
          } catch (err) {
            console.error(`Error fetching languages for ${repo.name}:`, err);
          }
        }
        setAggregatedLanguages(languages);

        // Get total contributions for each repo (sum of all contributors' contributions per repo)
        const repoContributions = [];
        for (const repo of repoData.slice(0, 10)) { // Limit to first 10 repos to avoid rate limits
          try {
            const contribData = await getRepoContributors(username, repo.name, '');
            const totalContributions = contribData.reduce((sum, contrib) => sum + contrib.contributions, 0);
            repoContributions.push({
              name: repo.name,
              contributions: totalContributions,
              full_name: repo.full_name
            });
          } catch (err) {
            console.error(`Error fetching contributors for ${repo.name}:`, err);
            // Add repo with 0 contributions if we can't fetch
            repoContributions.push({
              name: repo.name,
              contributions: 0,
              full_name: repo.full_name
            });
          }
        }

        // Sort repos by total contributions and take top 5
        const topReposByContributions = repoContributions
          .sort((a, b) => b.contributions - a.contributions)
          .slice(0, 5);

        console.log('Top repos by contributions:', topReposByContributions);
        setTopContributors(topReposByContributions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0);
  const totalRepos = repos.length;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const languageData = Object.entries(aggregatedLanguages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const contributorData = topContributors.map(repo => ({
    name: repo.name,
    contributions: repo.contributions
  }));

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", darkMode ? "bg-gray-900" : "bg-gray-50")}>
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen transition-colors", darkMode ? "bg-gray-900" : "bg-gray-50")}>
      <header className={cn("bg-white dark:bg-gray-800 shadow-sm", darkMode ? "border-b border-gray-700" : "border-b border-gray-200")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GitHub Visualizer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                )}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={cn("p-6 rounded-lg shadow", darkMode ? "bg-gray-800" : "bg-white")}>
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stars</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStars.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className={cn("p-6 rounded-lg shadow", darkMode ? "bg-gray-800" : "bg-white")}>
              <div className="flex items-center">
                <GitFork className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Forks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalForks.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className={cn("p-6 rounded-lg shadow", darkMode ? "bg-gray-800" : "bg-white")}>
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Watchers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWatchers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repos List */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Repositories ({totalRepos})</h2>
            <div className="grid grid-cols-1 gap-6">
              {repos.map((repo) => (
                <div key={repo.id} className={cn("p-6 rounded-lg shadow", darkMode ? "bg-gray-800" : "bg-white")}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      <a
                        href={`https://github.com/${username}/${repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    <div className="flex space-x-2">
                      <span className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                        <Star className="h-4 w-4 mr-1" /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <GitFork className="h-4 w-4 mr-1" /> {repo.forks_count}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{repo.description || 'No description'}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Code className="h-4 w-4 mr-1" />
                    Language: {repo.language || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* Sidebar: Charts and Activity */}
          <aside className="space-y-8">
            {/* Language Breakdown */}
            <div className={cn("p-6 rounded-lg shadow", darkMode ? "bg-gray-800" : "bg-white")}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2" /> Language Breakdown
              </h3>
              {languageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">No language data</p>
              )}
            </div>

            {/* Top Repositories by Contributions */}
            <div className={cn("p-6 rounded-lg shadow", darkMode ? "bg-gray-800" : "bg-white")}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2" /> Top Repositories by Contributions
              </h3>
              {topContributors.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={contributorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="name" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                    <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contributions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">No contributor data</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className={cn("p-6 rounded-lg shadow", darkMode ? "bg-gray-800" : "bg-white")}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" /> Recent Activity
              </h3>
              <ul className="space-y-2">
                {events.map((event, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    {event.type}: <a
                      href={`https://github.com/${username}/${event.repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {event.repo.name}
                    </a> - {new Date(event.created_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
