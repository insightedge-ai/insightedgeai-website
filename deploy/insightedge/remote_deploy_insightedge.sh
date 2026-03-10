#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/insightedge"

TMP_WEBSITE_ENV="/tmp/insightedge.website.env"
TMP_RAG_ENV="/tmp/insightedge.rag.env"
TMP_DEPLOY_ENV="/tmp/insightedge.deploy.env"
TMP_COMPOSE="/tmp/docker-compose.insightedge.yml"

WEBSITE_ALLOWLIST_FILE="${APP_DIR}/website.env.allowlist"
RAG_ALLOWLIST_FILE="${APP_DIR}/rag.env.allowlist"
DEPLOY_ALLOWLIST_FILE="${APP_DIR}/deploy.allowlist"

BACKUP_DIR="/opt/backups/insightedge"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

log() {
  printf '[%s] %s\n' "$(date '+%F %T')" "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
}

require_file() {
  local f="$1"
  [[ -f "$f" ]] || fail "Required file missing: $f"
}

get_env_value_from_file() {
  local key="$1"
  local file="$2"
  grep -E "^${key}=" "$file" | head -n1 | cut -d= -f2-
}

validate_env_file() {
  local file="$1"
  local allowlist="$2"
  local label="$3"

  require_file "$file"
  require_file "$allowlist"

  log "Validating ${label} file format"
  grep -nEv '^[A-Z0-9_]+=.*$|^$' "$file" && fail "Invalid ${label} line format detected" || true

  log "Checking duplicate keys in ${label}"
  local dups
  dups="$(
    grep -E '^[A-Z0-9_]+=' "$file" \
      | cut -d= -f1 \
      | sort \
      | uniq -d || true
  )"
  [[ -z "$dups" ]] || fail "Duplicate ${label} keys detected: $dups"

  log "Checking ${label} keys against allowlist"
  local tmp_keys allow_keys unexpected
  tmp_keys="$(mktemp)"
  allow_keys="$(mktemp)"

  grep -E '^[A-Z0-9_]+=' "$file" | cut -d= -f1 | sort -u > "$tmp_keys"
  grep -E '^[A-Z0-9_]+$' "$allowlist" | sort -u > "$allow_keys"

  unexpected="$(comm -23 "$tmp_keys" "$allow_keys" || true)"
  [[ -z "$unexpected" ]] || fail "Unexpected ${label} keys found: $(echo "$unexpected" | tr '\n' ' ')"

  rm -f "$tmp_keys" "$allow_keys"
}

mkdir -p "$BACKUP_DIR"
mkdir -p "$APP_DIR"

require_file "$TMP_WEBSITE_ENV"
require_file "$TMP_RAG_ENV"
require_file "$TMP_DEPLOY_ENV"
require_file "$WEBSITE_ALLOWLIST_FILE"
require_file "$RAG_ALLOWLIST_FILE"
require_file "$DEPLOY_ALLOWLIST_FILE"

validate_env_file "$TMP_WEBSITE_ENV" "$WEBSITE_ALLOWLIST_FILE" "website runtime env"
validate_env_file "$TMP_RAG_ENV" "$RAG_ALLOWLIST_FILE" "rag runtime env"
validate_env_file "$TMP_DEPLOY_ENV" "$DEPLOY_ALLOWLIST_FILE" "deploy env"

log "Backing up current runtime files"
[[ -f "${APP_DIR}/.env.website" ]] && cp "${APP_DIR}/.env.website" "${BACKUP_DIR}/.env.website.${TIMESTAMP}.bak"
[[ -f "${APP_DIR}/.env.rag" ]] && cp "${APP_DIR}/.env.rag" "${BACKUP_DIR}/.env.rag.${TIMESTAMP}.bak"
[[ -f "${APP_DIR}/.deploy.env" ]] && cp "${APP_DIR}/.deploy.env" "${BACKUP_DIR}/.deploy.env.${TIMESTAMP}.bak"
[[ -f "${APP_DIR}/docker-compose.yml" ]] && cp "${APP_DIR}/docker-compose.yml" "${BACKUP_DIR}/docker-compose.${TIMESTAMP}.yml.bak"

log "Installing new env files atomically"
install -m 600 "$TMP_WEBSITE_ENV" "${APP_DIR}/.env.website"
install -m 600 "$TMP_RAG_ENV" "${APP_DIR}/.env.rag"
install -m 600 "$TMP_DEPLOY_ENV" "${APP_DIR}/.deploy.env"

if [[ -f "$TMP_COMPOSE" ]]; then
  log "Installing uploaded docker-compose.yml"
  install -m 644 "$TMP_COMPOSE" "${APP_DIR}/docker-compose.yml"
fi

require_file "${APP_DIR}/docker-compose.yml"
require_file "${APP_DIR}/.env.website"
require_file "${APP_DIR}/.env.rag"
require_file "${APP_DIR}/.deploy.env"

GHCR_USERNAME="$(get_env_value_from_file GHCR_USERNAME "${APP_DIR}/.deploy.env" || true)"
GHCR_TOKEN="$(get_env_value_from_file GHCR_TOKEN "${APP_DIR}/.deploy.env" || true)"

[[ -n "$GHCR_USERNAME" ]] || fail "GHCR_USERNAME missing from ${APP_DIR}/.deploy.env"
[[ -n "$GHCR_TOKEN" ]] || fail "GHCR_TOKEN missing from ${APP_DIR}/.deploy.env"

log "Logging in to GHCR"
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

log "Validating docker compose config"
docker compose -f "${APP_DIR}/docker-compose.yml" config > /dev/null

log "Pulling images"
docker compose -f "${APP_DIR}/docker-compose.yml" pull

log "Starting updated stack"
docker compose -f "${APP_DIR}/docker-compose.yml" up -d --force-recreate --remove-orphans

log "Pruning dangling images"
docker image prune -f >/dev/null 2>&1 || true

log "Waiting briefly for services to settle"
sleep 5

if [[ -x "${APP_DIR}/healthcheck.sh" ]]; then
  log "Running app health check"
  "${APP_DIR}/healthcheck.sh" || fail "Health check failed after deployment"
fi

log "Deployment completed successfully"
