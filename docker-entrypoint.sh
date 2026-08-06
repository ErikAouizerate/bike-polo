#!/bin/sh
set -e

echo "Running database migrations..."
npx drizzle-kit migrate

echo "Starting Next.js..."
exec yarn start
