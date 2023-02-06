var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import { attemptConnection } from "./connection.js";
import getmac from "getmac";
import crypto from "crypto";
import lib from "./lib.js";
const wait = () => __awaiter(void 0, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, 10000)); });
const tryFetching = (bottle) => __awaiter(void 0, void 0, void 0, function* () {
    const user = crypto.createHash("md5").update(getmac()).digest("hex");
    // This does not send me your MAC address (not that I could do much with it anyway.)
    // It sends me a hash of it, and I'm using that to keep track of how many people
    // are using Starbuccaneer.
    const uri = `https://starbuccaneer.com/check?user=${user}`;
    const response = yield fetch(uri);
    const message = yield response.text();
    bottle.message = message;
});
const main = (announceActivity = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (announceActivity) {
        lib.log("Checking connectivity...");
    }
    const bottle = { message: "" };
    try {
        yield Promise.race([tryFetching(bottle), wait()]);
    }
    catch (e) {
        lib.log("Connection to health check server was refused.");
        yield attemptConnection();
        yield main();
        return;
    }
    if (bottle.message && bottle.message === "ahoy matey") {
        if (announceActivity) {
            lib.log("No connectivity problems detected.");
            lib.log("Will continue to quietly check connectivity...");
        }
        yield (() => __awaiter(void 0, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, 10000)); }))();
        yield main(false);
    }
    else {
        lib.log("Health check timeout.");
        yield attemptConnection();
        yield main();
    }
});
export default main;
