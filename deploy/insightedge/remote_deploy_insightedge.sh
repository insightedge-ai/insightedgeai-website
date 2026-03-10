#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/insightedge"
TMP_DIR="/tmp/insightedge-deploy"
BACKUP_DIR="/opt/backups/insightedge/$(date +%Y%m%d_%H%M%S)"

WEBSITE_ENV_TMP="${TMP_DIR}/.env.website"
RAG_ENV_TMP="${TMP_DIR}/.env.rag"
DEPLOY_ENV_TMP="${TMP_DIR}/.deploy.env"

COMPOSE_TMP="${TMP_DIR}/docker-compose.yml"
WEBSITE_ALLOWLIST_TMP="${TMP_DIR}/website.env.allowlist"
RAG_ALLOWLIST_TMP="${TMP_DIR}/rag.env.allowlist"
DEPLOY_ALLOWLIST_TMP="${TMP_DIR}/deploy.allowlist"
HEALTHCHECK_TMP="${TMP_DIR}/healthcheck.sh"
REMOTE_DEPLOY_TMP="${TMP_DIR}/remote_deploy_insightedge.sh"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

fail() {
  log "ERROR: $*"
  exit 1
}

require_file() {
  local f="$1"
  [[ -f "$f" ]] || fail "Required file missing: $f"
  [[ -s "$f" ]] || fail "Required file is empty: $f"
}

validate_env_against_allowlist() {
  local env_file="$1"
  local allowlist_file="$2"

  local tmp_keys_env tmp_keys_allow
  tmp_keys_env="$(mktemp)"
  tmp_keys_allow="$(mktemp)"

  awk -F= '/^[A-Z0-9_]+=/ {print $1}' "$env_file" | sort -u > "$tmp_keys_env"
  sed 's/#.*//' "$allowlist_file" | sed '/^\s*$/d' | sort -u > "$tmp_keys_allow"

  if ! diff -u "$tmp_keys_allow" "$tmp_keys_env"; then
    rm -f "$tmp_keys_env" "$tmp_keys_allow"
    fail "Env validation failed for $env_file against $allowlist_file"
  fi

  rm -f "$tmp_keys_env" "$tmp_keys_allow"
}

mkdir -p "$APP_DIR"
mkdir -p "$(dirname "$BACKUP_DIR")"
mkdir -p "$BACKUP_DIR"

require_file "$WEBSITE_ENV_TMP"
require_file "$RAG_ENV_TMP"
require_file "$DEPLOY_ENV_TMP"
require_file "$COMPOSE_TMP"
require_file "$WEBSITE_ALLOWLIST_TMP"
require_file "$RAG_ALLOWLIST_TMP"
require_file "$DEPLOY_ALLOWLIST_TMP"
require_file "$HEALTHCHECK_TMP"
require_file "$REMOTE_DEPLOY_TMP"

log "Validating environment files against allowlists"
validate_env_against_allowlist "$WEBSITE_ENV_TMP" "$WEBSITE_ALLOWLIST_TMP"
validate_env_against_allowlist "$RAG_ENV_TMP" "$RAG_ALLOWLIST_TMP"
validate_env_against_allowlist "$DEPLOY_ENV_TMP" "$DEPLOY_ALLOWLIST_TMP"

log "Backing up current deployment files if present"
for f in \
  docker-compose.yml \
  .env.website \
  .env.rag \
  .deploy.env \
  website.env.allowlist \
  rag.env.allowlist \
  deploy.allowlist \
  healthcheck.sh \
  remote_deploy_insightedge.sh
do
  if [[ -f "${APP_DIR}/${f}" ]]; then
    cp -a "${APP_DIR}/${f}" "${BACKUP_DIR}/${f}"
  fi
done

log "Installing new deployment files into ${APP_DIR}"
install -m 644 "$COMPOSE_TMP" "${APP_DIR}/docker-compose.yml"
install -m 600 "$WEBSITE_ENV_TMP" "${APP_DIR}/.env.website"
install -m 600 "$RAG_ENV_TMP" "${APP_DIR}/.env.rag"
install -m 600 "$DEPLOY_ENV_TMP" "${APP_DIR}/.deploy.env"
install -m 644 "$WEBSITE_ALLOWLIST_TMP" "${APP_DIR}/website.env.allowlist"
install -m 644 "$RAG_ALLOWLIST_TMP" "${APP_DIR}/rag.env.allowlist"
install -m 644 "$DEPLOY_ALLOWLIST_TMP" "${APP_DIR}/deploy.allowlist"
install -m 750 "$HEALTHCHECK_TMP" "${APP_DIR}/healthcheck.sh"
install -m 750 "$REMOTE_DEPLOY_TMP" "${APP_DIR}/remote_deploy_insightedge.sh"

log "Loading deploy environment"
set -a
source "${APP_DIR}/.deploy.env"
set +a

[[ -n "${GHCR_USERNAME:-}" ]] || fail "GHCR_USERNAME is not set"
[[ -n "${GHCR_TOKEN:-}" ]] || fail "GHCR_TOKEN is not set"

cat "${APP_DIR}/.env.website" "${APP_DIR}/.env.rag" > "${APP_DIR}/.env.runtime"
chmod 600 "${APP_DIR}/.env.runtime"

log "Logging into GHCR"
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

log "Pulling latest images"
docker compose -f "${APP_DIR}/docker-compose.yml" --env-file "${APP_DIR}/.env.runtime" pull

log "Starting containers"
docker compose -f "${APP_DIR}/docker-compose.yml" --env-file "${APP_DIR}/.env.runtime" up -d --force-recreate --remove-orphans

log "Running healthcheck"
"${APP_DIR}/healthcheck.sh"

log "Deployment completed successfully"
