# Manual Installation Guide

## Prerequisites

1. Docker CLI (LTS)
2. Docker Desktop (LTS)
3. Node & NPM (LTS)

## Routes

| Traefik Path | Service |
| ---      | ---      |
| http://localhost:9090   | Traefik Dashboard   |
| http://localhost:1337   | Next App   |
| http://localhost:1337/docs   | Documentation   |
| http://localhost:1337/api   | Next App's API   |
| http://localhost:1337/api/graphql   | Hasura GraphQL Engine   |
| http://localhost:1337/api/cms   | Strapi GraphQL Engine   |
| http://localhost:1337/dapr/functions/auth   | API Service: Auth   |
| http://localhost:1337/_admin/pgadmin   | PG Admin for Docker Postgres   |
| http://localhost:1337/_admin/hasura/console   | Hasura Console   |
| http://localhost:1337/_admin/cms   | Strapi Admin Dashboard   |
| http://localhost:1337/admin   | Strapi Admin Redirect   |
| http://localhost:1337/i18n   | Strapi i18n Redirect   |
