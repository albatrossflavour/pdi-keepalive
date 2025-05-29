Uses playwright to keep your Service Now Personal Developer Instance from hibernating



Needs some environment variables (use .env):

```
SERVICENOW_URL=https://devXXXXXXX.service-now.com
SERVICENOW_USER=admin
SERVICENOW_PASS=XXXXXXXXXXX
PING_INTERVAL=3600
```

Then you can run it with `docker run -d --name pdi-keepalive --env-file .env --restart unless-stopped albatrossflavour/pdi-keepalive`

