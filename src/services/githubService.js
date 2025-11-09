import axios from 'axios';

const API_BASE = 'https://api.github.com';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

export const getUserRepos = async (username, token, perPage = 100) => {
  const config = {
    params: { per_page: perPage, sort: 'updated', direction: 'desc' },
  };
  if (token) {
    config.headers = { Authorization: `token ${token}` };
  }
  const response = await api.get(`/users/${username}/repos`, config);
  return response.data;
};

export const getRepo = async (owner, repo, token) => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `token ${token}` };
  }
  const response = await api.get(`/repos/${owner}/${repo}`, config);
  return response.data;
};

export const getRepoContributors = async (owner, repo, token, perPage = 100) => {
  const config = {
    params: { per_page: perPage, anon: 'true' },
  };
  if (token) {
    config.headers = { Authorization: `token ${token}` };
  }
  const response = await api.get(`/repos/${owner}/${repo}/contributors`, config);
  return response.data;
};

export const getRepoLanguages = async (owner, repo, token) => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `token ${token}` };
  }
  const response = await api.get(`/repos/${owner}/${repo}/languages`, config);
  return response.data;
};

export const searchRepos = async (query, token, perPage = 10) => {
  console.log('API call to search repos with query:', query);
  const config = {
    params: { q: query, per_page: perPage, sort: 'stars', order: 'desc' },
  };
  if (token) {
    config.headers = { Authorization: `token ${token}` };
  }
  const response = await api.get('/search/repositories', config);
  console.log('API response status:', response.status);
  console.log('API response data:', response.data);
  return response.data.items;
};

export const getUserEvents = async (username, token, perPage = 30) => {
  const config = {
    params: { per_page: perPage },
  };
  if (token) {
    config.headers = { Authorization: `token ${token}` };
  }
  const response = await api.get(`/users/${username}/events`, config);
  return response.data;
};