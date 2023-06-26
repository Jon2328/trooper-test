# Trooper Back End Test

## Env File
Example
```env
DB_HOST=127.0.0.1
DB_CLIENT=mysql2
DB_PORT=3306
DB_USER=mysql
DB_PASSWORD=mysql
DB_DATABASE=trooper-test
DB_SCHEMA=trooper-test
JWT_SECRET=secret
```

## Usage
```bash
yarn
yarn migrate:latest
yarn dev
```