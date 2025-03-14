# GitHub Repository Search

A responsive React application that allows users to search for GitHub repositories by username and filter them by name and programming language.

## Features

- Search for GitHub repositories by username
- Filter repositories by name
- Filter repositories by programming language
- Responsive design that works on mobile and desktop
- Material UI components for a modern interface
- Uses GitHub GraphQL API v4 for efficient data fetching

## Technologies Used

- React
- TypeScript
- Material UI
- Axios for API requests
- GitHub GraphQL API v4
- Vite for fast development

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GitHub Personal Access Token (for GraphQL API access)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd github-search
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your GitHub Personal Access Token to `.env` (You can create a token at https://github.com/settings/tokens)
   - No scopes are needed for accessing public repositories

```bash
cp .env.example .env
# Then edit .env and add your token
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a GitHub username in the search field
2. The application will fetch and display the user's repositories
3. Use the filter fields to filter repositories by name or programming language

## GitHub API Authentication

This app uses GitHub's GraphQL API v4, which requires authentication. 

1. Create a personal access token at https://github.com/settings/tokens
2. No scopes are required for accessing public repositories
3. Add the token to your `.env` file

## API Rate Limiting

The GitHub GraphQL API has a rate limit of 5,000 points per hour for authenticated requests. Each point represents a certain complexity cost.

## License

This project is licensed under the MIT License.
