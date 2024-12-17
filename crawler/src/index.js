"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
(function example() {
    return __awaiter(this, void 0, void 0, function* () {
        let driver = yield new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.FIREFOX).build();
        try {
            yield driver.get('https://www.google.com/ncr');
            yield driver.findElement(selenium_webdriver_1.By.name('q')).sendKeys('webdriver', selenium_webdriver_1.Key.RETURN);
            yield driver.wait(selenium_webdriver_1.until.titleIs('webdriver - Google Search'), 1000);
        }
        finally {
            yield driver.quit();
        }
    });
})();
