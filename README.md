Fullstack example project with [Svelte](https://svelte.dev)/[Vite](https://vitejs.dev), [Fastify](https://www.fastify.io) & [tRPC](https://trpc.io) all in _typescript_.

As a showcase _Login functionality via cookie/server-sessions_.

If you like video tutorials, https://www.youtube.com/watch?v=Lam0cYOEst8 walks you through a pretty similar setup (just with slightly different technologies like express, react, yarn workspaces, etc..).

_Note: I'm not intending to update this a lot in the furture, but if you have meaningful contributions (like unifying the typescript setup or an env setup for real production) i happily accept pull requests!_

# Project Structure

It's a very simple monorepo setup with NPM workspaces.
The [frontend](/frontend) and [backend](/backend) folders are separated node modules, the root module just calls the relevant sub-modules tasks for convenience.

- `frontend` contains a typical `Svelte`/`Vite` setup which could be used and operated standalone.
- `backend` has a minimal `fastify` HTTP server and the actual backend logic is crafted in `tRPC`.

## Development

During development 2 servers are started. Each one is refreshed/restarted automatically on relevant file changes.

- There is a standalone backend server (`fastify`).
- There is a standalone Vite server hosting the frontend. The frontend makes calls to the separate backend server.
- So you have to navigate to http://127.0.0.1:5173 to use the app.

## Production

- Frontend files are compiled to `/client/dist`.
- Backend hosts the logic but also serves the client files.
- So you have to navigate to http://127.0.0.1:3000 to use the app.

# Build

- `npm install` - Install node modules for all packages
- `npm run dev` - Starts the development servers (Use http://127.0.0.1:5173 for using the app)
- `npm run start` - Start production server (Use http://127.0.0.1:3000 for using the app)
