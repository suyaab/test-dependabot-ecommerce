# Local Development Environment SSL and Routing Configuration Guide

Follow this setup which loosely mimics our Azure Front Door logic locally for our 3 Next.js webapps. We use a combination of `nginx` as a reverse proxy and `mkcert` for local SSL setup. We will also use HTTP request headers to signal and re-direct URLs as needed. This approach allows you to route traffic based on paths or domains to your respective local apps running on different ports and handles HTTPS locally.

## Installation & Configuration

### Step 1: Install `nginx` and `mkcert`

Use [Homebrew](https://brew.sh/) to install `nginx` and `mkcert`.

```sh
brew install nginx
brew install mkcert
mkcert -install
```

### Step 2: Generate SSL Certificates

Create a directory for your SSL certificates and generate SSL certificates for your development domains.

```sh
mkdir -p /opt/homebrew/etc/nginx/certs

mkcert -cert-file /opt/homebrew/etc/nginx/certs/local.hellolingo.com.pem -key-file /opt/homebrew/etc/nginx/certs/local.hellolingo.com-key.pem local.hellolingo.com
mkcert -cert-file /opt/homebrew/etc/nginx/certs/local-shop.hellolingo.com.pem -key-file /opt/homebrew/etc/nginx/certs/local-shop.hellolingo.com-key.pem local-shop.hellolingo.com
```

### Step 3: Update `/etc/hosts` File

Run the command below to map your local `HelloLingo` domains to `127.0.0.1` in your `/etc/hosts` file.

```sh
echo -e "127.0.0.1 local.hellolingo.com\n127.0.0.1 local-shop.hellolingo.com" | sudo tee -a /etc/hosts > /dev/null
```

### Step 4: Configure `nginx`

Open the `nginx` configuration file located at `/opt/homebrew/etc/nginx/nginx.conf` and replace its contents with the following.

```nginx
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  gzip  on;
  include       mime.types;
  default_type  application/octet-stream;
  sendfile        on;
  keepalive_timeout  65;

  # NOTE
  # Turning this off since all front door does is route to the correct
  # app based on the path but it does also send the country code in the header

  # Define a variable based on the 'x-geo-country' HTTP header
  # map $http_x_geo_country $target_path {
  #   # Canonical empty string
  #   default "";
  #   # Route GB users to /uk
  #   GB      "/uk";
  #   # Route US users to /us currently
  #   # With next launch, default US to canonical
  #   # US      "/us";
  #   # Add country codes as needed for URL rewriting
  #   # DE      "/de";
  #   # IN      "/in";
  # }

  server {
    listen 443 ssl;
    http2 on;
    server_name local.hellolingo.com;
    ssl_certificate /opt/homebrew/etc/nginx/certs/local.hellolingo.com.pem;
    ssl_certificate_key /opt/homebrew/etc/nginx/certs/local.hellolingo.com-key.pem;

    # Use the $target_path variable to conditionally rewrite requests
    # if ($target_path != "") {
    #     rewrite ^/$ $target_path redirect;
    # }

    # dtc-shop/apps/web
    location /uk {
      proxy_pass http://localhost:3001;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
    # ecommrce/apps/web
    location / {
      proxy_pass http://localhost:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }

  server {
    listen 443 ssl;
    http2 on;
    server_name local-shop.hellolingo.com;
    ssl_certificate /opt/homebrew/etc/nginx/certs/local-shop.hellolingo.com.pem;
    ssl_certificate_key /opt/homebrew/etc/nginx/certs/local-shop.hellolingo.com-key.pem;
    # UK shop does not need to be rerouted as it is the canonical
    location / {
      proxy_pass http://localhost:3002;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }

  include servers/*;
}
```

### Step 5: Start your webapps

```sh
cd /path/to/your/dtc-shop
yarn install && yarn build && yarn dev

cd /path/to/your/ecommerce
pnpm install && pnpm build && pnpm dev
```

### Step 6: Start `nginx`

Start `nginx` with the following command:

```sh
brew services start nginx
```

### Step 7: Test Your Setup

Now that everything is set up, you can test the routing locally. Each path should route you to the respective Next.js app running on your local machine.

| App                | Localhost URL                      | Localhost Ports       | Info  |
| ------------------ | ---------------------------------- | --------------------- | ----- |
| 🇺🇸 [ecommerce/web] | https://local.hellolingo.com/      | http://localhost:3000 | 📣 🛍️ |
| 🇬🇧 [dtc-shop/home] | https://local.hellolingo.com/uk/   | http://localhost:3001 | 📣    |
| 🇬🇧 [dtc-shop/shop] | https://local-shop.hellolingo.com/ | http://localhost:3002 | 🛍️    |

## Troubleshooting Tips

If you encounter any issues, here are a few things to check:

- If you make changes to the configuration file, restart nginx with the following command: `brew services restart nginx`
- Ensure `nginx` is running and the configuration syntax is correct. You can check the configuration syntax with `sudo nginx -t`.
- Make sure your Next.js apps are running and accessible directly via their respective ports.
- Verify the SSL certificates are correctly referenced in the `nginx` configuration.
- Check the `/etc/hosts` file to ensure the domain `local.hellolingo.com` is correctly mapped to `127.0.0.1`.
- Check the `/etc/hosts` file to ensure the domain `local-shop.hellolingo.com` is correctly mapped to `127.0.0.1`.
- Check the `nginx` error and access logs which should be located in the `/opt/homebrew/var/log/nginx` folder.

## Geo Location Simulation

- You can use the [ModHeader](https://chromewebstore.google.com/detail/modheader-modify-http-hea/idgpnmonknjnojddfkpgkljpfnnfcklj) Chrome extension for ease of use.
- Set an HTTP header:
  - name: `x-geo-country`
  - possible values: `GB`, `US`, `XI`, `DE`, `IN`, etc.
- For example when you visit the canonical at https://local.hellolingo.com with `GB` as your country code, you should be re-directed to https://local.hellolingo.com/uk in your local envinronment.

This setup mimics the Azure Front Door routing logic locally, allowing you to test and develop your applications with a similar configuration to your production environment.

## High level routing rules

### US Soft Launch - June 2024

| App                | Production URL                  | Info  |
| ------------------ | ------------------------------- | ----- |
| 🇺🇸 [ecommerce/web] | https://www.hellolingo.com/us/* | 📣 🛍️ |
| 🇬🇧 [dtc-shop/home] | https://www.hellolingo.com/*    | 📣    |
| 🇬🇧 [dtc-shop/shop] | https://shop.hellolingo.com/*   | 🛍️    |

### US Product Launch - July 2024

| App                | Production URL                  | Info  |
| ------------------ | ------------------------------- | ----- |
| 🇺🇸 [ecommerce/web] | https://www.hellolingo.com/*    | 📣 🛍️ |
| 🇬🇧 [dtc-shop/home] | https://www.hellolingo.com/uk/* | 📣    |
| 🇬🇧 [dtc-shop/shop] | https://shop.hellolingo.com/*   | 🛍️    |

---

#### Legend

- 🇬🇧 - UK Market
- 🇺🇸 - US Market
- 📣 - Marketing Website
- 🛍️ - E-commerce Shopping Website

<!-- IMPORTANT: Below are reference links used throughout this document. Please do not delete. -->

[dtc-shop/home]: https://github.com/Abbott-Bluebird/dtc-shop/tree/main/apps/home
[dtc-shop/shop]: https://github.com/Abbott-Bluebird/dtc-shop/tree/main/apps/shop
[ecommerce/web]: https://github.com/Abbott-Bluebird/ecommerce/tree/main/apps/web
