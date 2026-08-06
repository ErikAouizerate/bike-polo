#!/bin/sh
set -e

echo "Building Next.js..."
yarn build

echo "Running database migrations..."
npx drizzle-kit migrate

echo "Starting Next.js..."
exec yarn start
