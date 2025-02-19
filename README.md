# Combat Command

## Getting Started

### Set-Up for Front-End Development

1. Create a new file in the root directory called `.env.local`.
2. Add the following values:

```
VITE_SUPABASE_URL=[your_url]
VITE_SUPABASE_ANON_KEY=[your_key]
VITE_MAPBOX_TOKEN=[your_token]
```

3. Run `npm ci` to install dependencies.
4. Run `npm run dev` to run locally.


### Set-Up for REST API Development

1. To get started working on the REST API, you'll need Homebrew, and to install Deno:

```sh
brew install deno
```

2. If using Visual Studio Code, you'll also need the [Deno extension](vscode:extension/denoland.vscode-deno).

3. A file called .vscode/settings.json will be created in your workspace.
Ensure the following values are set:

```json
{
  "deno.enable": true,
  "deno.enablePaths": ["./supabase/functions"],
}
```

4. Finally, run the following to install dependencies:

```sh
deno install
```