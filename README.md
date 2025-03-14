# GitHub Search

A modern React application for searching GitHub repositories and user profiles with a beautiful Material-UI interface. This application allows you to explore GitHub users, view their repositories, and access detailed information about both users and repositories.


<img width="1352" alt="Screenshot 2025-03-14 at 19 49 59" src="https://github.com/user-attachments/assets/8f211a7f-9323-47fa-9e6f-d2a86b96c143" />

<img width="1352" alt="Screenshot 2025-03-14 at 19 50 05" src="https://github.com/user-attachments/assets/72b6a899-08e2-4a5b-8404-6df4644369c0" />

## Features

- Search for GitHub users by username
- View detailed user profiles including bio, location, and social links
- Browse user repositories with filtering options
- Dark/light theme toggle for better user experience
- Responsive design that works on desktop and mobile devices

## Technologies Used

- React
- TypeScript
- Material-UI
- Storybook for component documentation
- Vitest and React Testing Library for testing

## Installation

To get started with the GitHub Search application, follow these steps:

```bash
# Clone the repository
git clone https://github.com/yourusername/github-search.git
cd github-search

# Install dependencies
npm install
```

## Running the Application

To run the application in development mode:

```bash
npm start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Running the Test Suite

This project uses Vitest and React Testing Library for testing. To run the test suite:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Using Storybook

This project includes Storybook for component development and documentation:

```bash
# Start Storybook
npm run storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Future Improvements

The following improvements are planned for future versions:

1. **Advanced Search Features**
   - Add search filters for repositories by stars, and forks
   - Implement pagination for search results
   - Add sorting options for repository lists

2. **User Experience Enhancements**
   - Add loading animations and skeleton screens
   - Implement caching for improved performance
   - Add user preferences storage (saved searches, preferred theme)

3. **Additional Features**
   - Repository trending visualization
   - User activity timeline
   - GitHub API rate limit monitoring
   - Support for GitHub authentication to increase API rate limits


