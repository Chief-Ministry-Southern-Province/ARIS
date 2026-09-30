# ─── Stage 1: PHP Composer dependencies ─────────────────────────────────────
FROM composer:2.8 AS vendor

WORKDIR /app

COPY aris-backend/composer.json aris-backend/composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts \
    --ignore-platform-reqs

# ─── Stage 2: Production image (PHP 8.4 — required by Symfony 8.1.x) ────────
FROM php:8.4-fpm-alpine

LABEL maintainer="ARIS Team"
LABEL description="ARIS Laravel 13 Backend"

# System dependencies
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    curl \
    shadow \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        zip \
        exif \
        bcmath \
        gd \
        opcache \
        pcntl

# PHP OPcache tuning for production
COPY docker/backend/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Suppress PHP 8.4 3rd-party vendor deprecation warnings in production
RUN echo "error_reporting = E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED" > /usr/local/etc/php/conf.d/error-reporting.ini

WORKDIR /var/www/html

# Copy application source
COPY aris-backend/ .

# Copy Composer vendor from Stage 1
COPY --from=vendor /app/vendor ./vendor

# Set correct ownership
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Expose port for artisan serve
EXPOSE 8000

# Default command: serve the application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
