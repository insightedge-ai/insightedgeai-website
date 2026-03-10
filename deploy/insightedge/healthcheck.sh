#!/usr/bin/env bash
set -Eeuo pipefail

check_with_retry() {
  local cmd="$1"
  local label="$2"
  local attempts="${3:-20}"
  local sleep_seconds="${4:-3}"

  echo "Checking ${label}"

  for ((i=1; i<=attempts; i++)); do
    if eval "$cmd" >/dev/null 2>&1; then
      echo "OK: ${label}"
      return 0
    fi

    echo "Attempt $i/$attempts failed for ${label}; waiting ${sleep_seconds}s..."
    sleep "$sleep_seconds"
  done

  echo "FAILED: ${label}"
  return 1
}

check_with_retry \
  "curl -fsS --max-time 10 https://insightedgeai.co.uk/" \
  "https://insightedgeai.co.uk/" \
  20 3

check_with_retry \
  "docker run --rm --network web curlimages/curl:8.8.0 -fsS --max-time 10 http://insightedgeai-rag-backend:8010/health" \
  "RAG backend /health on Docker network" \
  20 3
