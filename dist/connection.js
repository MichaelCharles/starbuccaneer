var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
import getmac from "getmac";
import lib from "./lib.js";
export function attemptConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        lib.log("Attempting connection...");
        const browser = yield puppeteer.launch({ headless: true });
        try {
            const page = yield browser.newPage();
            yield Promise.all([
                page.waitForNavigation(),
                yield page.goto(`https://service.wi2.ne.jp/wi2auth/redirect?cmd=login&mac=${getmac()}&essid=%20&apname=tunnel%201&apgroup=&url=http%3A%2F%2Fexample%2Ecom%2F%3F${Math.floor(Math.random() * 999999999)}`),
            ]);
            const afterRedirectTitle = yield page.evaluate(() => {
                return document.title;
            });
            if (afterRedirectTitle === "logged in" ||
                afterRedirectTitle === "at_STARBUCKS_Wi2") {
                lib.log("Already logged in.");
                yield (() => __awaiter(this, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, 60000)); }))();
                yield browser.close();
                return;
            }
            lib.log("Page loaded, clicking on CONNECT...");
            yield Promise.all([
                page.waitForNavigation(),
                page.click('input[type="submit"]'),
            ]);
            lib.log("Reading terms of use...");
            yield page.waitForTimeout(2000);
            lib.log("And clicking on agree...");
            let buttonAcceptWorked = false;
            yield Promise.all([
                page.waitForNavigation(),
                new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    yield page.$eval(`#button_accept`, (element) => element.click());
                    buttonAcceptWorked = true;
                    resolve();
                })),
                new Promise((resolve) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        if (!buttonAcceptWorked) {
                            lib.log("Attempting 'Retry'...");
                            page.$eval(`#alertArea a`, (element) => element.click());
                        }
                        resolve();
                    }), 5000);
                }),
            ]);
            const title = yield page.evaluate(() => {
                return document.title;
            });
            lib.log(`Navigated to ${title}`);
            if (title === "logged in" || title === "at_STARBUCKS_Wi2") {
                lib.log("Automatic login successful.");
                yield (() => __awaiter(this, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, 5000)); }))();
            }
            else {
                lib.log("Automatic login failed. " +
                    `Title was ${title}. Expected 'logged in' or 'at_STARBUCKS_Wi2'.`);
                yield (() => __awaiter(this, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, 5000)); }))();
            }
            yield browser.close();
        }
        catch (e) {
            lib.log("Automatic login failed with error.");
            lib.log(e.message);
            yield (() => __awaiter(this, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, 5000)); }))();
            yield browser.close();
        }
    });
}
export default function main() {
    return __awaiter(this, void 0, void 0, function* () {
        lib.log("Started...");
        attemptConnection();
        setInterval(attemptConnection, 1000 * 60);
    });
}
