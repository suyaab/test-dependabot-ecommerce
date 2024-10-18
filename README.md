# Lingo E-commerce

This repository is Lingo's E-commerce monorepo, which supports the web application, and various integrations

This project is built with [Turborepo](https://turbo.build/) includes the following packages/apps:

### Apps and Packages

- `web`: [Next.js](https://nextjs.org/) app
- `functions`: [Azure NodeJS Functions (v4)](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4)
  serverless app
- `@ecommerce/analytics`: a shared package that tracks page visits and user events
- `@ecommerce/auth`: a shared package that allows users to login, logout, etc.
- `@ecommerce/cms`: a shared package that retrieves all content from the CMS
- `@ecommerce/commerce`: a shared package that interfaces with a commerce engine.
- `@ecommerce/consent`: a shared package tracks user consent for all legal documents.
- `@ecommerce/finance`: a shared package handles all payments, transactions, and authorizations.
- `@ecommerce/logger`: a utility that creates a singleton logger for all applications to use.
- `@ecommerce/marketing`: a shared package that exposes a marketing to track users and respective events.
- `@ecommerce/notifications`: a shared package that allows for programmatically sending user email notifications.
- `@ecommerce/utils`: a shared package that holds any helpers, utility functions, or shared types.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/). Each shared package is transpiled
using [`tsup`](https://tsup.egoist.dev)

### Utilities

This project also has quite a bit of shared configuration to be used for the entire monorepo like:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [tsup](https://tsup.egoist.dev) for building and transpiling
- [ESLint](https://eslint.org/) for code linting
- [Vitest](https://vitest.dev/) for unit tests
- [Prettier](https://prettier.io) for code formatting

These utilities live in the following area:

- `@ecommerce/config/eslint`: a shared package for `eslint` configurations
- `@ecommerce/config/tailwind`: a shared package that shares ui/tailwind configuration
- `@ecommerce/config/typescript`: a shared package that shares typescript configuration

## Getting Started 
### Installation
1. Git clone this repository using SSH. This organization enforces SAML SSO
  - [Generating new SSH Key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
  - [Add SSH Key to Github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
  - [Authenticate with SAML SSO](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-an-ssh-key-for-use-with-saml-single-sign-on)
2. We use `nvm` to handle our Node.js versions

   - Follow the [instructions here](https://github.com/nvm-sh/nvm#installing-and-updating) to install `nvm`
   - Then install and activate this repo's current Node version

   ```
   nvm install
   nvm use
   ```
3. Since Node.js v16.13, we can use `corepack` for managing package managers:
   ```
   corepack enable
   ```
4. Install dependencies:
   ```
   pnpm install
   ```
5. Create a file named `.env.local` and copy the corresponding env variables (ask a team member for this) in the path:

   - `<path to ecommerce>/apps/web/.env.local`
6. #### Build

   To build all apps and packages, run the following command from the root directory of the project:
   ```
   pnpm build
   ```

7. #### Develop

   To develop all apps and packages, run the following command from the root directory of the project:
   ```
   pnpm dev
   ```

6. Now you can open your browser and see the website on: `http://localhost:3000/`

### Install Dependencies

```sh
pnpm add <package-name> --filter="{shared package to add dependency to}"
```

### Storybook

To view our stories run.

```sh
pnpm storybook
```

### SSL and Routing Configuration Guide

For a detailed walkthrough on setting up SSL and routing for local development for all of our Next.js webapps,
leveraging nginx as a reverse proxy and mkcert for SSL to emulate Azure Front Door, see
our [Local Development Environment SSL and Routing Configuration Guide](docs/LocalSSLAndRoutingSetup.md).

### Docker

#### Build

To build this application's Docker image, run:

```sh
docker buildx build \
  -t dtc-web --no-cache --progress=plain \
  -f apps/web/Dockerfile .
```

#### Run

To create a running container of the image that was just built on port `3000`, run:

```sh
docker run -p 3000:3000 -d --env-file ./apps/web/.env.local dtc-web
```
