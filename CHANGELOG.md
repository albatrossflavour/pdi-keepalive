# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.1] - 2025-10-02

### Added

- Retry logic for network requests (up to 3 attempts with 2-second delays)
- Extended timeouts (60 seconds) to handle Kubernetes network latency
- Multi-platform Docker image support (linux/amd64 and linux/arm64)

### Changed

- Improved error handling with warnings for failed retry attempts
- Navigation now explicitly uses `waitUntil: 'domcontentloaded'` parameter
- Pinned Playwright version to match Docker base image (1.55.0)

### Fixed

- Resolved intermittent `ERR_NETWORK_CHANGED` errors when running as Kubernetes CronJob

## [v1.0] - 2025-05-29

### Initial Release

- ServiceNow PDI keep-alive functionality using Playwright
- Docker container support
- Environment variable configuration
