const puppeteer = require("puppeteer");
const fs = require("fs");

async function getAllCookies(page) {
  try {
    const client = await page.target().createCDPSession();
    const allBrowserCookies = (await client.send("Network.getAllCookies"))
      .cookies;
    const cookiePath = "./cookies.json";
    fs.writeFileSync(cookiePath, JSON.stringify(allBrowserCookies, null, 2));
  } catch (err) {
    // do nothing
    console.log(err);
  }
}

async function setAllCookies(page) {
  try {
    const cookiePath = "./cookies.json";
    const cookiesString = fs.readFileSync(cookiePath);
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
  } catch (err) {
    // do nothing
    console.log(err);
  }
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`https://service.wi2.ne.jp/freewifi/starbucks/index.html`);

    await getAllCookies(page);

    console.log("Page loaded, clicking on CONNECT...");
    await Promise.all([
      page.waitForNavigation(),
      page.click('input[type="submit"]'),
    ]);

    await setAllCookies(page);

    console.log("Reading terms of use...");
    await page.waitForTimeout(2000);

    console.log("And clicking on agree...");
    await Promise.all([
      page.waitForNavigation(),
      page.$eval(`#button_accept`, (element) => element.click()),
      setTimeout(async () => {
        console.log("Attempting 'Retry'...");
        page.$eval(`#alertArea a`, (element) => element.click());
      }, 5000),
    ]);

    const title = await page.evaluate(() => {
      return document.title;
    });

    console.log(`Navigated to ${title}`);

    if (title === "logged in") {
      console.log("Automatic login successful.");
    } else {
      console.log("Automatic login failed.");
    }
    await browser.close();
  } catch (e) {
    console.log("Automatic login failed.");
    console.log(e.message);
    browser.close();
  }
}

main();
