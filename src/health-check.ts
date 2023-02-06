import fetch from "node-fetch";
import { attemptConnection } from "./connection.js";
import getmac from "getmac";
import crypto from "crypto";
import lib from "./lib.js";

interface Bottle {
  message: string;
}

const wait = async () => new Promise((resolve) => setTimeout(resolve, 10000));

const tryFetching = async (bottle: Bottle) => {
  const user = crypto.createHash("md5").update(getmac()).digest("hex");
  // This does not send me your MAC address (not that I could do much with it anyway.)
  // It sends me a hash of it, and I'm using that to keep track of how many people
  // are using Starbuccaneer.
  const uri = `https://starbuccaneer.com/check?user=${user}`;

  const response = await fetch(uri);
  const message = await response.text();
  bottle.message = message;
};

const main = async (announceActivity = true) => {
  if (announceActivity) {
    lib.log("Checking connectivity...");
  }
  const bottle: Bottle = { message: "" };
  try {
    await Promise.race([tryFetching(bottle), wait()]);
  } catch (e) {
    lib.log("Connection to health check server was refused.");
    await attemptConnection();
    await main();
    return;
  }

  if (bottle.message && bottle.message === "ahoy matey") {
    if (announceActivity) {
      lib.log("No connectivity problems detected.");
      lib.log("Will continue to quietly check connectivity...");
    }
    await (async () => new Promise((resolve) => setTimeout(resolve, 10000)))();
    await main(false);
  } else {
    lib.log("Health check timeout.");
    await attemptConnection();
    await main();
  }
};

export default main;
