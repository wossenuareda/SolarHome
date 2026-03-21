#!/usr/bin/env bash
set -euo pipefail
echo "Install deps"
npm ci
echo "Run lint and type-check"
npm run lint || true
npm run type-check || true
echo "Dev server not started by bootstrap. Run: npm run dev"

