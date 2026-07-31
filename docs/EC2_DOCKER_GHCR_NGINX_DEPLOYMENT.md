# ARIS: EC2 + Docker Hub + GitHub Actions + Nginx

This guide deploys the ARIS React frontend and Laravel backend to one EC2 instance. It assumes **MySQL already runs on that EC2 host**. GitHub Actions builds images, pushes them to Docker Hub, then tells EC2 to pull and restart them.

## 1. What will run where

```text
Browser
  -> HTTPS 443 -> Nginx container
       /             React static files
       /api/*        Laravel PHP-FPM container
       /sanctum/*    Laravel PHP-FPM container
       /app/*        Reverb WebSocket container

EC2 Docker network
  nginx, api, worker, reverb

EC2 host
  existing MySQL, reached through its Unix socket

GitHub Actions
  build -> push immutable images to Docker Hub -> SSH deploy to EC2
```

Do not expose MySQL (3306), PHP-FPM (9000), or Reverb (8080) to the internet. EC2 security-group inbound rules should allow 80/443 publicly and SSH only from your office IP (or use AWS SSM instead).

## 2. One-time EC2 preparation

On Amazon Linux 2023:

```bash
# Update the operating system packages.
sudo yum update -y

# Install the Docker Engine package.
sudo yum install -y docker

# Start Docker now and after every EC2 restart.
sudo systemctl enable --now docker

# Allow ec2-user to run docker without sudo; log out and back in afterwards.
sudo usermod -aG docker ec2-user
```

Install Docker Compose if `docker compose version` does not work. Then create the deployment directory:

```bash
# Keep deployment files outside the public web directory.
sudo mkdir -p /opt/aris/deploy/nginx
sudo chown -R ec2-user:ec2-user /opt/aris

# Clone only after the directory ownership is correct.
git clone <YOUR_PRIVATE_GITHUB_REPOSITORY_URL> /opt/aris
cd /opt/aris
```

### Existing MySQL: use a Unix socket

Using a socket avoids opening port 3306. Find the current MySQL socket path:

```bash
# Prints the socket path, for example /var/lib/mysql/mysql.sock.
mysqladmin variables | grep socket
```

Create a database user that can access only the ARIS database. Run this in MySQL as an administrator:

```sql
-- Create the database only if it does not already exist.
CREATE DATABASE aris CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create an application user; replace the password before running this.
CREATE USER 'aris_app'@'localhost' IDENTIFIED BY 'replace-with-a-long-random-password';

-- Give the application only the permissions it needs on its own database.
GRANT ALL PRIVILEGES ON aris.* TO 'aris_app'@'localhost';

-- Apply the permission changes immediately.
FLUSH PRIVILEGES;
```

## 3. Build images

Create the following files in the repository. The backend image is used by the API, worker, and Reverb services.

### `aris-backend/Dockerfile`

```dockerfile
# Stage 1: install PHP dependencies only once.
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts

# Stage 2: the small PHP-FPM runtime image.
FROM php:8.3-fpm-alpine
RUN apk add --no-cache libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev libxml2-dev oniguruma-dev icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" bcmath gd intl mbstring pcntl pdo_mysql xml zip

# This path must match Nginx's SCRIPT_FILENAME path.
WORKDIR /var/www/html
COPY --from=vendor /app/vendor ./vendor
COPY . .
RUN php scripts/apply-mpdf-mark-glyph-sets-patch.php \
    && chown -R www-data:www-data storage bootstrap/cache

# PHP-FPM listens only inside the Docker network.
EXPOSE 9000
CMD ["php-fpm"]
```

`--no-dev` excludes test/development packages. `--no-scripts` avoids running Laravel commands before a production `.env` exists. The final `RUN` applies this repository's mPDF patch and grants PHP write access to cache and storage.

### `deploy/nginx/Dockerfile`

```dockerfile
# Build the React production bundle inside Docker.
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY aris-frontend/package.json aris-frontend/package-lock.json ./
RUN npm ci
COPY aris-frontend/ .

# Vite replaces these values while building. They are public browser settings.
ARG VITE_API_BASE_URL
ARG VITE_REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT=443
ARG VITE_REVERB_SCHEME=https
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY
ENV VITE_REVERB_HOST=$VITE_REVERB_HOST
ENV VITE_REVERB_PORT=$VITE_REVERB_PORT
ENV VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME
RUN npm run build

# Serve the built static files with Nginx.
FROM nginx:1.27-alpine
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
```

### `deploy/nginx/default.conf`

Create the folders used by Certbot on the host before starting Compose: `mkdir -p /opt/aris/deploy/certbot/{conf,www}`.

```nginx
# HTTP is used only for Let's Encrypt validation and HTTPS redirect.
server {
    listen 80;
    server_name aris.example.gov.lk;

    # Certbot writes challenge files here; Let's Encrypt reads them over port 80.
    location /.well-known/acme-challenge/ { root /var/www/certbot; }

    # Everything else must use encrypted HTTPS.
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name aris.example.gov.lk;

    # Certificate files shared with the Certbot container.
    ssl_certificate /etc/letsencrypt/live/aris.example.gov.lk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aris.example.gov.lk/privkey.pem;

    # React build files are already inside this Nginx image.
    root /usr/share/nginx/html;
    index index.html;

    # Laravel API and Sanctum CSRF endpoints.
    location ~ ^/(api|sanctum)/ {
        # The asset-init service places Laravel public files on this volume.
        root /var/www/html/public;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Never allow arbitrary PHP files; only internal Laravel routing can reach this block.
    location ~ \.php$ {
        internal;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/html/public$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT /var/www/html/public;
        fastcgi_pass api:9000;
    }

    # Keep Upgrade headers so Reverb can upgrade HTTP to WebSocket.
    location /app/ {
        proxy_pass http://reverb:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # SPA fallback: a direct browser route still returns React's index.html.
    location / { try_files $uri $uri/ /index.html; }
}
```

Replace every `aris.example.gov.lk` with your actual domain before building. Nginx uses FastCGI for PHP-FPM and reverse-proxies WebSockets to Reverb.

## 4. Docker Compose on EC2

Create `deploy/compose.yaml`:

```yaml
services:
  # Copies Laravel's public/index.php into a volume Nginx can read.
  asset-init:
    image: ${API_IMAGE}:${IMAGE_TAG}
    command: ["/bin/sh", "-c", "rm -rf /shared/* && cp -a /var/www/html/public/. /shared/"]
    volumes: ["laravel_public:/shared"]
    restart: "no"

  nginx:
    image: ${WEB_IMAGE}:${IMAGE_TAG}
    depends_on:
      asset-init:
        condition: service_completed_successfully
      api:
        condition: service_started
      reverb:
        condition: service_started
    ports: ["80:80", "443:443"]
    volumes:
      - laravel_public:/var/www/html/public:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    restart: unless-stopped

  api:
    image: ${API_IMAGE}:${IMAGE_TAG}
    env_file: ../aris-backend/.env
    extra_hosts: ["host.docker.internal:host-gateway"]
    volumes:
      - aris_storage:/var/www/html/storage
      - ${MYSQL_SOCKET_HOST}:/var/run/mysqld/mysqld.sock
    restart: unless-stopped

  worker:
    image: ${API_IMAGE}:${IMAGE_TAG}
    command: php artisan queue:work --tries=3 --timeout=120 --sleep=3
    env_file: ../aris-backend/.env
    extra_hosts: ["host.docker.internal:host-gateway"]
    volumes:
      - aris_storage:/var/www/html/storage
      - ${MYSQL_SOCKET_HOST}:/var/run/mysqld/mysqld.sock
    restart: unless-stopped

  reverb:
    image: ${API_IMAGE}:${IMAGE_TAG}
    command: php artisan reverb:start --host=0.0.0.0 --port=8080
    env_file: ../aris-backend/.env
    volumes: ["aris_storage:/var/www/html/storage"]
    restart: unless-stopped

volumes:
  laravel_public: {}
  aris_storage: {}
```

`asset-init` is a short-lived container: it makes Laravel's `public/index.php` available to Nginx without mounting the whole application source from the host. `extra_hosts` maps `host.docker.internal` to the Linux host gateway; it is useful for diagnostics, but the actual database connection below uses the mounted socket.

## 5. Environment files

Create `/opt/aris/deploy/.env` (never commit it):

```dotenv
# Docker Hub image names use: <dockerhub-username>/<repository>.
API_IMAGE=your-dockerhub-username/aris-api
WEB_IMAGE=your-dockerhub-username/aris-web

# GitHub Actions overrides this with the commit SHA during deployment.
IMAGE_TAG=latest

# Use the exact socket path discovered with mysqladmin.
MYSQL_SOCKET_HOST=/var/lib/mysql/mysql.sock
```

Create `/opt/aris/aris-backend/.env`:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://aris.example.gov.lk

# Laravel uses this mounted Unix socket, not port 3306.
DB_CONNECTION=mysql
DB_SOCKET=/var/run/mysqld/mysqld.sock
DB_DATABASE=aris
DB_USERNAME=aris_app
DB_PASSWORD=replace-with-the-database-password

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_DOMAIN=aris.example.gov.lk
FRONTEND_URLS=https://aris.example.gov.lk
SANCTUM_STATEFUL_DOMAINS=aris.example.gov.lk

QUEUE_CONNECTION=database
CACHE_STORE=database
BROADCAST_CONNECTION=reverb
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080
REVERB_HOST=aris.example.gov.lk
REVERB_PORT=443
REVERB_SCHEME=https
REVERB_APP_ID=replace-me
REVERB_APP_KEY=replace-me
REVERB_APP_SECRET=replace-me
```

## 6. Docker Hub login on EC2

For private Docker Hub repositories, create a Docker Hub access token with pull/read access. On EC2:

```bash
# The token is read from the terminal and is not placed in shell history.
read -s DOCKERHUB_TOKEN
echo "$DOCKERHUB_TOKEN" | docker login -u <YOUR_DOCKERHUB_USERNAME> --password-stdin
unset DOCKERHUB_TOKEN
```

## 7. GitHub Actions workflow

Create `.github/workflows/deploy.yml`. Replace the two image names with your Docker Hub names.

```yaml
name: Build and deploy ARIS

on:
  push:
    branches: [main] # Deploy only reviewed main-branch changes.

permissions:
  contents: read # Allows checkout only; Docker Hub uses its own token.

env:
  API_IMAGE: your-dockerhub-username/aris-api
  WEB_IMAGE: your-dockerhub-username/aris-web

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: docker/login-action@v3
        with:
          username: ${{ vars.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/setup-buildx-action@v3
      - name: Build and push Laravel image
        uses: docker/build-push-action@v6
        with:
          context: aris-backend
          push: true
          tags: ${{ env.API_IMAGE }}:${{ github.sha }},${{ env.API_IMAGE }}:latest
      - name: Build and push Nginx/React image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: deploy/nginx/Dockerfile
          push: true
          build-args: |
            VITE_API_BASE_URL=https://aris.example.gov.lk/api
            VITE_REVERB_APP_KEY=${{ secrets.REVERB_APP_KEY }}
            VITE_REVERB_HOST=aris.example.gov.lk
            VITE_REVERB_PORT=443
            VITE_REVERB_SCHEME=https
          tags: ${{ env.WEB_IMAGE }}:${{ github.sha }},${{ env.WEB_IMAGE }}:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Configure SSH key
        run: |
          mkdir -p ~/.ssh
          printf '%s' "${{ secrets.EC2_SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          printf '%s\n' "${{ secrets.EC2_KNOWN_HOSTS }}" > ~/.ssh/known_hosts
      - name: Pull immutable images and restart services
        run: |
          ssh -i ~/.ssh/id_ed25519 ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} \
            "cd /opt/aris/deploy && IMAGE_TAG=${{ github.sha }} docker compose pull && IMAGE_TAG=${{ github.sha }} docker compose up -d && IMAGE_TAG=${{ github.sha }} docker compose exec -T api php artisan migrate --force && IMAGE_TAG=${{ github.sha }} docker compose exec -T api php artisan optimize"
```

GitHub secrets required: `DOCKERHUB_TOKEN`, `EC2_HOST`, `EC2_USER`, `EC2_SSH_PRIVATE_KEY`, `EC2_KNOWN_HOSTS`, and `REVERB_APP_KEY`. Add `DOCKERHUB_USERNAME` as a GitHub Actions variable. The commit SHA tag is immutable; do not deploy `latest` because it makes rollback unclear.

## 8. HTTPS bootstrap and first run

1. Point DNS to the EC2 Elastic IP and open ports 80/443.
2. Create a temporary self-signed certificate so Nginx can start once:

```bash
cd /opt/aris/deploy
mkdir -p certbot/conf/live/aris.example.gov.lk certbot/www
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout certbot/conf/live/aris.example.gov.lk/privkey.pem \
  -out certbot/conf/live/aris.example.gov.lk/fullchain.pem \
  -subj "/CN=aris.example.gov.lk"
```

3. Set `IMAGE_TAG` to an image tag already pushed by Actions, then start services and initialise Laravel:

```bash
IMAGE_TAG=<COMMIT_SHA> docker compose up -d
IMAGE_TAG=<COMMIT_SHA> docker compose exec api php artisan key:generate --force
IMAGE_TAG=<COMMIT_SHA> docker compose exec api php artisan migrate --force
IMAGE_TAG=<COMMIT_SHA> docker compose exec api php artisan optimize
```

4. Replace the temporary certificate with Let's Encrypt:

```bash
docker run --rm -v "$PWD/certbot/conf:/etc/letsencrypt" -v "$PWD/certbot/www:/var/www/certbot" certbot/certbot certonly --webroot -w /var/www/certbot -d aris.example.gov.lk --email you@example.gov.lk --agree-tos --no-eff-email
docker compose exec nginx nginx -s reload
```

Renew monthly with a host cron job, then reload Nginx:

```bash
0 3 1 * * cd /opt/aris/deploy && docker run --rm -v "$$PWD/certbot/conf:/etc/letsencrypt" -v "$$PWD/certbot/www:/var/www/certbot" certbot/certbot renew && docker compose exec -T nginx nginx -s reload
```

## 9. Seeders: run once, never on every deployment

Always run migrations on deployment. Do **not** automatically run `db:seed` in the GitHub Actions deployment command, and never run `migrate:fresh --seed` against production. `migrate:fresh` drops all tables.

The current ARIS seeders have different safety levels:

| Seeder | Current behavior | Production rule |
| --- | --- | --- |
| `RoleSeeder` | Uses `firstOrCreate()` | Safe to run once; repeat-safe. |
| `WorkflowSettingSeeder` | Uses `firstOrCreate()` | Safe to run once; repeat-safe. |
| `InstitutionSeeder` | Uses `create()` | Run only for an empty database; a repeat creates duplicate institutions. |
| `AdminSeeder` | Requires explicit runtime values and uses `firstOrCreate()` by NIC | Run once after roles and institutions exist; it is safe to retry without creating a duplicate. |
| `DatabaseSeeder` | Creates a test user, then calls `InstitutionSeeder` | Do not run in production. |

For a brand-new, empty production database, run only the intentional bootstrap seeders after migrations:

```bash
# Create authorization roles. Safe because RoleSeeder uses firstOrCreate.
IMAGE_TAG=<COMMIT_SHA> docker compose exec api php artisan db:seed --class=RoleSeeder --force

# Create default workflow settings. Safe because it uses firstOrCreate.
IMAGE_TAG=<COMMIT_SHA> docker compose exec api php artisan db:seed --class=WorkflowSettingSeeder --force

# Run this only once on an empty database; it currently uses create().
IMAGE_TAG=<COMMIT_SHA> docker compose exec api php artisan db:seed --class=InstitutionSeeder --force
```

After roles and institutions exist, create the first System Admin once. First list institution IDs and choose the intended institution:

```bash
# Shows institution IDs, names, and types without changing data.
IMAGE_TAG=<COMMIT_SHA> docker compose exec api php artisan tinker --execute="App\\Models\\Institution::select('id', 'name', 'type')->orderBy('id')->get();"
```

Then run the seeder. The `read` commands keep the values out of shell history; replace `1` with the chosen institution ID.

```bash
read -r -p "Admin name: " INITIAL_ADMIN_NAME
read -r -p "Admin NIC: " INITIAL_ADMIN_NIC
read -r -p "Admin mobile: " INITIAL_ADMIN_MOBILE
read -r -s -p "Admin password: " INITIAL_ADMIN_PASSWORD; echo

INITIAL_ADMIN_INSTITUTION_ID=1 \
IMAGE_TAG=<COMMIT_SHA> docker compose exec \
  -e INITIAL_ADMIN_NAME \
  -e INITIAL_ADMIN_NIC \
  -e INITIAL_ADMIN_MOBILE \
  -e INITIAL_ADMIN_PASSWORD \
  -e INITIAL_ADMIN_INSTITUTION_ID \
  api php artisan db:seed --class=AdminSeeder --force

unset INITIAL_ADMIN_NAME INITIAL_ADMIN_NIC INITIAL_ADMIN_MOBILE INITIAL_ADMIN_PASSWORD INITIAL_ADMIN_INSTITUTION_ID
```

`AdminSeeder` requires all five values, hashes the password, finds an existing user by NIC before creating one, and adds `system_admin` only when that role is absent. It deliberately does not overwrite an existing user's password or profile on a retry.

Before any seeding command, take a MySQL backup:

```bash
# Write a timestamped backup outside the application container.
mysqldump -u aris_app -p aris > "/opt/aris/backups/aris-$(date +%F-%H%M%S).sql"
```

## 10. Verify and operate

```bash
# Show service state and recent logs.
docker compose ps
docker compose logs --tail=100 nginx api worker reverb

# Confirm migrations and queues are healthy.
docker compose exec api php artisan about
docker compose exec worker php artisan queue:monitor default
```

Browser checks: sign in, refresh (Sanctum cookie persists), log out, upload/download a file, and confirm a Reverb notification. Back up host MySQL separately with `mysqldump` and copy backups off the instance.

## Security notes

- Keep `.env`, Docker Hub tokens, SSH private keys, database passwords, and `REVERB_APP_SECRET` out of GitHub and Docker images.
- Use GitHub Environment protection rules for production deployments.
- Pin third-party GitHub Actions to commit SHAs before a regulated production release.
- This is still one EC2 instance. For resilience, move MySQL to RDS and uploads to S3.

## References

- [GitHub: publishing Docker images with Actions](https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images)
- [Docker Hub access tokens and GitHub Actions](https://docs.docker.com/guides/gha/)
- [NGINX reverse proxy and FastCGI](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy)
- [AWS EC2 security-group rules](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html)
