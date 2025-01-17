# SPA
Run `cd web` and `npm run start` for Angular SPA, web app runs on [localhost](http://localhost:4200)

## API
Run `cd api` and `npm run start` for API

## Ollama
First run `ollama serve`, when it's up run `ollama run llama3.2`

## Database
* `npx drizzle-kit generate` to generate migration scripts, use `npx drizzle-kit push` to apply scripts
* `CREATE EXTENSION IF NOT EXISTS vector;` make sure vector extension is installed
* Make sure embedding models' number of dimension match the size in schema, (e.g. 768)
