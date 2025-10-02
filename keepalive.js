require("dotenv").config();
const { chromium } = require("playwright");

const interval = parseInt(process.env.PING_INTERVAL || "900", 10) * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const keepAlive = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set longer timeouts for Kubernetes network conditions
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

  try {
    console.log(`[${new Date().toISOString()}] Logging into ServiceNow...`);

    // Retry logic for initial navigation
    let loginSuccess = false;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await page.goto(`${process.env.SERVICENOW_URL}/login.do`, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        loginSuccess = true;
        break;
      } catch (e) {
        console.warn(
          `[${new Date().toISOString()}] Login navigation attempt ${attempt}/${MAX_RETRIES} failed:`,
          e.message,
        );
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY);
        } else {
          throw e;
        }
      }
    }

    await page.fill("#user_name", process.env.SERVICENOW_USER);
    await page.fill("#user_password", process.env.SERVICENOW_PASS);
    await page.click("#sysverb_login");

    await page.waitForLoadState("domcontentloaded");

    // Retry logic for post-login navigation
    let navSuccess = false;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await page.goto(
          `${process.env.SERVICENOW_URL}/nav_to.do?uri=sys_user_list.do`,
          {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          },
        );
        navSuccess = true;
        break;
      } catch (e) {
        console.warn(
          `[${new Date().toISOString()}] Navigation attempt ${attempt}/${MAX_RETRIES} failed:`,
          e.message,
        );
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY);
        } else {
          throw e;
        }
      }
    }

    await page.waitForTimeout(3000);

    console.log(`[${new Date().toISOString()}] Ping complete.`);
  } catch (e) {
    console.error(`[${new Date().toISOString()}] Error during keep-alive:`, e);
    throw e; // Re-throw to cause job failure
  } finally {
    await browser.close();
  }
};

(async () => {
  await keepAlive();
  console.log(`[${new Date().toISOString()}] Keepalive completed, exiting.`);
})();
