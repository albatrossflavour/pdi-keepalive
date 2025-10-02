# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a ServiceNow Personal Developer Instance (PDI) keep-alive service. It uses Playwright to automatically log into a ServiceNow instance periodically, preventing it from hibernating due to inactivity.

## Architecture

- **Single-file application**: `keepalive.js` contains all logic
- **Playwright-based**: Uses headless Chromium to simulate user activity
- **One-shot execution**: Runs once and exits (designed to be triggered externally, e.g., via cron or scheduled task)
- **Docker-based deployment**: Packaged as a container using the official Playwright image

## Key Configuration

Environment variables (stored in `.env`):
- `SERVICENOW_URL`: The ServiceNow instance URL
- `SERVICENOW_USER`: ServiceNow username (typically `admin`)
- `SERVICENOW_PASS`: ServiceNow password
- `PING_INTERVAL`: Interval in seconds (default: 900) - Note: currently only used as a configuration value, actual scheduling happens externally

## Development Commands

**Install dependencies:**
```bash
npm install
```

**Run locally:**
```bash
node keepalive.js
```

**Build Docker image (single platform):**
```bash
docker build -t albatrossflavour/pdi-keepalive .
```

**Build and push multi-platform Docker image:**
```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t albatrossflavour/pdi-keepalive:latest \
  -t albatrossflavour/pdi-keepalive:v1.X \
  --push .
```

**Run Docker container:**
```bash
docker run -d --name pdi-keepalive --env-file .env --restart unless-stopped albatrossflavour/pdi-keepalive
```

## Release Process

1. Update code and test locally
2. **IMPORTANT**: Ensure Playwright version in `package.json` matches the Docker base image version in `Dockerfile` (must be exact match, not using `^` range)
3. Update package version in `package.json`
4. Update `CHANGELOG.md` with changes
5. Build and push multi-platform image with new version tag:
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 \
     -t albatrossflavour/pdi-keepalive:latest \
     -t albatrossflavour/pdi-keepalive:vX.Y \
     --push .
   ```
6. Update deployment manifests (e.g., Kubernetes CronJob) with new version tag or SHA

## Implementation Notes

- The application performs a single keep-alive operation: logs in → navigates to user list → exits
- **Retry logic**: Implements up to 3 retry attempts for network requests with 2-second delays (helps with Kubernetes network initialisation issues)
- **Timeout handling**: Uses 60-second timeouts to accommodate network latency in containerised environments
- **Version synchronisation**: Playwright npm package version MUST exactly match the Playwright Docker base image version to avoid runtime errors
- Error handling: catches and logs errors, then re-throws to signal failure to orchestration layer
- Uses `waitForLoadState('domcontentloaded')` to ensure page stability before navigation
- Includes a 3-second wait after navigation to ensure activity is registered by ServiceNow

## Docker Image

**Registry:** `docker.io/albatrossflavour/pdi-keepalive`

**Supported platforms:**
- `linux/amd64` (Intel/AMD x86_64)
- `linux/arm64` (ARM64/Apple Silicon)

**Tags:**
- `latest` - Most recent build
- `vX.Y` - Specific version (see CHANGELOG.md)
