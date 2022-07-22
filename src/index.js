const puppeteer = require("puppeteer");
const getmac = require("getmac").default;

async function attemptConnection() {
  console.log("Attempting connection...");
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();

    await Promise.all([
      page.waitForNavigation(),
      await page.goto(
        `https://service.wi2.ne.jp/wi2auth/redirect?cmd=login&mac=${getmac()}&essid=%20&apname=tunnel%201&apgroup=&url=http%3A%2F%2Fexample%2Ecom%2F%3F${Math.floor(
          Math.random() * 999999999
        )}`
      ),
    ]);

    const afterRedirectTitle = await page.evaluate(() => {
      return document.title;
    });

    if (
      afterRedirectTitle === "logged in" ||
      afterRedirectTitle === "at_STARBUCKS_Wi2"
    ) {
      console.log("Already logged in.");
      await browser.close();
      return;
    }

    console.log("Page loaded, clicking on CONNECT...");
    await Promise.all([
      page.waitForNavigation(),
      page.click('input[type="submit"]'),
    ]);

    console.log("Reading terms of use...");
    await page.waitForTimeout(2000);

    console.log("And clicking on agree...");
    let buttonAcceptWorked = false;
    await Promise.all([
      page.waitForNavigation(),
      new Promise(async (resolve) => {
        await page.$eval(`#button_accept`, (element) => element.click());
        buttonAcceptWorked = true;
        resolve();
      }),
      new Promise((resolve) => {
        setTimeout(async () => {
          if (!buttonAcceptWorked) {
            console.log("Attempting 'Retry'...");
            page.$eval(`#alertArea a`, (element) => element.click());
          }
          resolve();
        }, 5000);
      }),
    ]);

    const title = await page.evaluate(() => {
      return document.title;
    });

    console.log(`Navigated to ${title}`);

    if (title === "logged in" || title === "at_STARBUCKS_Wi2") {
      console.log("Automatic login successful.");
    } else {
      console.log("Automatic login failed.");
    }
    await browser.close();
  } catch (e) {
    console.log("Automatic login failed.");
    console.log(e.message);
    await browser.close();
  }
}

module.exports = async function main() {
  console.log("Started...");
  attemptConnection();
  setInterval(attemptConnection, 1000 * 60);
};
