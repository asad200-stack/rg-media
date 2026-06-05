#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && ! echo "$DATABASE_URL" | grep -q "sslmode="; then
  export DATABASE_URL="${DATABASE_URL}?sslmode=require"
fi

echo "Applying database schema..."
npm run push -w @rg-media/database

if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  npm run seed -w @rg-media/database
fi

echo "Starting API..."
node apps/api/dist/main.js
