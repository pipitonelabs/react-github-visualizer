# GitHub Visualizer

A simple React-based tool for visualizing GitHub repository data, including stats, languages, contributors, and recent activity.

**Live Demo**: [https://react-github-visualizer.vercel.app/](https://react-github-visualizer.vercel.app/)

## Features

- **Overview Stats**: Displays total stars, forks, and watchers across all repositories
- **Repository List**: Shows all public repositories with key details
- **Language Breakdown**: Pie chart showing programming languages used
- **Top Contributors**: Bar chart of top contributors for the most starred repository
- **Recent Activity**: List of recent GitHub events
- **Dark Mode**: Toggle between light and dark themes

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- Recharts
- Axios
- Lucide React

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-github-visualizer.git
   cd react-github-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Usage

The app automatically fetches and displays data for the configured GitHub user. No additional setup required for basic usage.

## Configuration

To visualize data for a different GitHub user, update the `username` variable in `src/App.jsx`.
