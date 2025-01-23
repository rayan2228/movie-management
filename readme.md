# Movie Management API

This is a Node.js and Express.js-based API for managing movies.

## Features

- Add new movies.
- Fetch a list of movies.
- Update movie details.
- rate the movies

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Getting Started

Follow the steps below to set up the API locally.

### 1. Clone the Repository

```bash
git clone https://github.com/rayan2228/movie-management.git
cd movie-management
```

### 2. Install Dependencies

Use npm or yarn to install the required dependencies:

#### Using npm:

```bash
npm install
```

#### Using yarn:

```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables from `.env.example` file.

### 4. Start the Server

Run the following command to start the development server:

#### Using npm:

```bash
npm start
```

#### Using yarn:

```bash
yarn start
```

The API should now be running at `http://localhost:8000/api/v1` (or the port you configured in the `.env` file).

### 5. Test the API

Use a tool like [Postman](https://documenter.getpostman.com/view/35167967/2sAYQdkAnc) to test the API endpoints.

## Project Structure

```
movie-management-api/
├── src/
│   ├── public/             # any public files
│   ├── controllers/        # API logic
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── middlewares/        # Middleware functions (e.g., authentication)
│   ├── db/                 # Setup database
│   ├── utils/              # Utility functions
│   ├── services/           # External services
│   ├── templates/          # Like mail templates
│   └── app.js              # Express app setup
│   └── constants.js        # Setup constants variables
├── .env                    # Environment variables
├── .env.example            # Environment variables copy
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── README.md               # Documentation
└── server.js               # Entry point
```

## Scripts

Here are the scripts defined in `package.json`:

- **`npm start`**: Start the server in production mode.
- **`npm run dev`**: Start the server in development mode using [nodemon](https://nodemon.io/).

## Technologies Used

- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
