# Authentication

## Overview

Authentication package is the primary way for this team to authenticate users

## `AuthService`

This service exposes the ability to retrieve `AuthUser`, as well as the ability to retrieve the `Customer` object for
the current `AuthUser` logged in.

## Usage

Retrieve the `AuthUser`

```ts
const authService = ServiceLocator.getAuthService();
const authUser = await authService.getUser();
```

Or retrieve the `Customer` via the `AuthUser`

```ts
const authService = ServiceLocator.getAuthService();
const customer = await authService.getAuthenticatedCustomer();
```

> [!WARNING]  
> When using this package in a web application, you must also bring in the `@auth0/nextjs-auth0` dependency in order to
> use `withPageAuthRequired` to secure each page.

## Future Improvements

1. Expose `@auth0/nextjs-auth0` dependencies (like `withPageAuthRequired`) from this package. This would eliminate
   needing to import `@auth0/nextjs-auth0` in both this package and the usage of this package. Secondly, this could
   potentially improve how we use `await authRegionCheck();` by bringing that logic into this package and unifying it
   behind the `withPageAuthRequired` we expose (that calls `@auth0/nextjs-auth0`'s `withPageAuthRequired`)
