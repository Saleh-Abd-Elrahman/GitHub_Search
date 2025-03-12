# GitHub Repository Search

A responsive React application that allows users to search for GitHub repositories by username and filter them by name and programming language.

## Features

- Search for GitHub repositories by username
- Filter repositories by name
- Filter repositories by programming language
- Responsive design that works on mobile and desktop
- Material UI components for a modern interface

## Technologies Used

- React
- TypeScript
- Material UI
- Axios for API requests
- Vite for fast development

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

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

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a GitHub username in the search field
2. The application will fetch and display the user's repositories
3. Use the filter fields to filter repositories by name or programming language

## API Rate Limiting

The GitHub API has rate limiting. For unauthenticated requests, the rate limit allows for up to 60 requests per hour.

## License

This project is licensed under the MIT License.
