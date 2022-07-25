import puppeteer from "puppeteer";
import getmac from "getmac";
import lib from "./lib.js";

export async function attemptConnection() {
  lib.log("Attempting connection...");
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
      lib.log("Already logged in.");
      await (async () =>
        new Promise((resolve) => setTimeout(resolve, 60000)))();
      await browser.close();
      return;
    }

    lib.log("Page loaded, clicking on CONNECT...");
    await Promise.all([
      page.waitForNavigation(),
      page.click('input[type="submit"]'),
    ]);

    lib.log("Reading terms of use...");
    await page.waitForTimeout(2000);

    lib.log("And clicking on agree...");
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
            lib.log("Attempting 'Retry'...");
            page.$eval(`#alertArea a`, (element) => element.click());
          }
          resolve();
        }, 5000);
      }),
    ]);

    const title = await page.evaluate(() => {
      return document.title;
    });

    lib.log(`Navigated to ${title}`);

    if (title === "logged in" || title === "at_STARBUCKS_Wi2") {
      lib.log("Automatic login successful.");
      await (async () =>
        new Promise((resolve) => setTimeout(resolve, 60000)))();
    } else {
      lib.log("Automatic login failed.");
      await (async () =>
        new Promise((resolve) => setTimeout(resolve, 60000)))();
    }
    await browser.close();
  } catch (e) {
    lib.log("Automatic login failed.");
    await (async () => new Promise((resolve) => setTimeout(resolve, 60000)))();
    lib.log(e.message);
    await browser.close();
  }
}

export default async function main() {
  lib.log("Started...");
  attemptConnection();
  setInterval(attemptConnection, 1000 * 60);
}
