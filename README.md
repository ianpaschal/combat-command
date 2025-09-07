# Combat Command


## Contributing

### Structure

The back-end of the application is located in `/convex`

The front-end of the application is located in `/src`

### Set-Up for Development

1. Create a new file in the root directory called `.env.local`.
2. Add the following values:

```
CONVEX_DEPLOYMENT=[your_deployment_name]
VITE_CONVEX_URL=[your_url]
VITE_MAPBOX_TOKEN=[your_token]
```

3. Run `npm ci` to install dependencies.
4. Run `npm run dev` to run locally.
