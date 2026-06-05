#!/bin/sh
set -e

echo "Applying database schema..."
npm run push -w @rg-media/database

if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  npm run seed -w @rg-media/database
fi

echo "Starting API..."
node apps/api/dist/main.js
