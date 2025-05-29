require('dotenv').config();
const { chromium } = require('playwright');

const interval = parseInt(process.env.PING_INTERVAL || "900", 10) * 1000;

const keepAlive = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`[${new Date().toISOString()}] Logging into ServiceNow...`);
    await page.goto(`${process.env.SERVICENOW_URL}/login.do`);

    await page.fill('#user_name', process.env.SERVICENOW_USER);
    await page.fill('#user_password', process.env.SERVICENOW_PASS);
    await page.click('#sysverb_login');

    await page.waitForLoadState('domcontentloaded');
    await page.goto(`${process.env.SERVICENOW_URL}/nav_to.do?uri=sys_user_list.do`);
    await page.waitForTimeout(3000);

    console.log(`[${new Date().toISOString()}] Ping complete.`);
  } catch (e) {
    console.error(`[${new Date().toISOString()}] Error during keep-alive:`, e);
  } finally {
    await browser.close();
  }
};

(async () => {
  while (true) {
    await keepAlive();
    console.log(`[${new Date().toISOString()}] Sleeping for ${interval / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
})();
