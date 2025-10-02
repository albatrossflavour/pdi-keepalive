# PDI Keep-Alive

Uses playwright to keep your Service Now Personal Developer Instance from hibernating

## Environment Variables

Needs some environment variables (use .env):

```bash
SERVICENOW_URL=https://devXXXXXXX.service-now.com
SERVICENOW_USER=admin
SERVICENOW_PASS=XXXXXXXXXXX
PING_INTERVAL=3600
```

## Usage

**Docker:**

```bash
docker run -d --name pdi-keepalive --env-file .env --restart unless-stopped albatrossflavour/pdi-keepalive
```

**Kubernetes:**

See example deployment as a CronJob in [home-ops/kubernetes/apps/utilities/pdi-keepalive](https://github.com/albatrossflavour/home-ops/tree/main/kubernetes/apps/utilities/pdi-keepalive/app)
