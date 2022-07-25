import fetch from "node-fetch";
import { attemptConnection } from "./connection.js";
import getmac from "getmac";
import crypto from "crypto";
import lib from "./lib.js";

const wait = async () => new Promise((resolve) => setTimeout(resolve, 10000));

const tryFetching = async (bottle) => {
  const user = crypto.createHash("md5").update(getmac()).digest("hex");
  // This does not send me your MAC address (not that I could do much with it anyway.)
  // It sends me a hash of it, and I'm using that to keep track of how many people
  // are using Starbuccaneer.
  const uri = `https://starbuccaneer.com/check?user=${user}`;

  const response = await fetch(uri);
  const message = await response.text();
  bottle.message = message;
};

const main = async () => {
  lib.log("Checking connectivity...");
  const bottle = {};
  try {
    await Promise.race([tryFetching(bottle), wait()]);
  } catch (e) {
    lib.log("Connection to health check server was refused.");
    await attemptConnection();
    await main();
    return;
  }

  if (bottle.message && bottle.message === "ahoy matey") {
    lib.log("No connectivity problems detected.");
    await (async () => new Promise((resolve) => setTimeout(resolve, 10000)))();
    await main();
  } else {
    lib.log("Health check timeout.");
    await attemptConnection();
    await main();
  }
};

export default main;
