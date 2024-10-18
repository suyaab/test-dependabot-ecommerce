# Countries

Logic for calculating what path the user should be at based on what country the user is in.

Server side

1. Read the country code from http headers for x_geo_country, this is added by Azure Front Door
2. Read the current path the user is in
3. Determine if they are in the right path for their country
4. Optionally show a modal informing the user to switch to the correct store

## Redirect Logic

### Pre-US launch

| URL                          | App         | Repo     |
| ---------------------------- | ----------- | -------- |
| www.hellolingo.com/          | UK Homepage | dtc-shop |
| shop.hellolingo.com/products | UK PDP      | dtc-shop |

### Phase 1

- `basePath: "/us"` in `next.config.mjs`
- Only marketing pages

| URL                          | App         | Repo      |
| ---------------------------- | ----------- | --------- |
| www.hellolingo.com/          | UK Homepage | dtc-shop  |
| shop.hellolingo.com/products | UK PDP      | dtc-shop  |
| www.hellolingo.com/us/       | US Homepage | ecommerce |

#### Scenarios

| Country Code | Subdomain | Path  | Is Path Valid | Repo      | Result                 |
| ------------ | --------- | ----- | ------------- | --------- | ---------------------- |
| `US`         | `www`     | `/us` | yes           | ecommerce | no action              |
| `US`         | `www`     | `/`   | no            | dtc-shop  | redirect to `/us/`     |
| `GB`         | `www`     | `/us` | no            | ecommerce | modal with link to `/` |
| `GB`         | `www`     | `/`   | yes           | dtc-shop  | no action              |
| `GB`         | `shop`    | `/`   | yes           | dtc-shop  | no action              |

### Phase 2

- `basePath` is removed from `next.config.mjs` and added to the `dtc-shop` repo instead as `/uk`
- We start taking orders

| URL                          | App          | Repo      |
| ---------------------------- | ------------ | --------- |
| www.hellolingo.com/uk        | UK Homepage  | dtc-shop  |
| shop.hellolingo.com/products | UK PDP       | dtc-shop  |
| www.hellolingo.com/          | US Homepage  | ecommerce |
| www.hellolingo.com/products  | US PDP       | ecommerce |
| www.hellolingo.com/uk/blog   | Shared Blogs | ecommerce |

#### Scenarios

| Country Code | Subdomain | Path        | Is Path Valid | Repo      | Result                                      |
| ------------ | --------- | ----------- | ------------- | --------- | ------------------------------------------- |
| `US`         | `www`     | `/`         | yes           | ecommerce | no action                                   |
| `US`         | `www`     | `/products` | yes           | ecommerce | no action                                   |
| `US`         | `www`     | `/us`       | no            | ecommerce | redirect to `/`                             |
| `US`         | `www`     | `/uk`       | no            | dtc-shop  | redirect to `/`                             |
| `US`         | `shop`    | `/products` | no            | dtc-shop  | redirect to `www.hellolingo.com/products/`  |
| `GB`         | `www`     | `/us`       | no            | ecommerce | modal with link to `/uk`                    |
| `GB`         | `www`     | `/`         | no            | ecommerce | redirect to `/uk`                           |
| `GB`         | `www`     | `/uk`       | yes           | dtc-shop  | no action                                   |
| `GB`         | `shop`    | `/products` | yes           | dtc-shop  | no action                                   |
| `GB`         | `www`     | `/products` | no            | dtc-shop  | redirect to `shop.hellolingo.com/products/` |

### Phase 3

TBD, most likely will consolidate both repos into ecommerce
