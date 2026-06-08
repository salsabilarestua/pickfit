FROM richarvey/nginx-php-fpm:latest

# Instal Node.js dan NPM di dalam server
RUN apk add --no-cache nodejs npm

# Set direktori kerja
WORKDIR /var/www/html

# Salin semua file project lu ke dalam Docker
COPY . .

# Jalankan instalasi dependensi
RUN composer install --no-dev --optimize-autoloader
RUN npm install

# Set port untuk Laravel dan jalankan server.js di background saat container start
EXPOSE 80 8085
CMD ["sh", "-c", "node server.js & npm run prod & /start.sh"]