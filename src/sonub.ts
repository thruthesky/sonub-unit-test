import { getNightmare } from './nightmare';
import * as t from './test';
const cheerio = require('cheerio');

declare var document;

export class Sonub {

    nightmare = getNightmare();
    cio = cheerio;

    url = "https://www.sonub.com";

    constructor() {

    }


    async open() {
        console.log("open() ... ...... ..");
        return this.nightmare.goto(this.url)
            .evaluate(() => {
                return document.querySelector('html').innerHTML;
            })
    }

    async go(route) {
        console.log(`Sonub::go(${route}) ...`);
        return this.nightmare.goto(this.url + route)
            .evaluate(() => {
                return document.querySelector('html').innerHTML;
            })
    }

    async type(selector, text) {
        return this.nightmare.type(selector, text)
            .evaluate(() => {
                return document.querySelector('html').innerHTML;
            })
    }

    end() {
        this.nightmare.end();
        process.exit(0);
    }

    isTrue(re, msg = '') {
        if (re === true) this.success(msg);
        else this.failure(msg);
    }

    isFalseExit(re, msg?) {
        if (!re) {
            this.failure(msg);
            this.end();
        }
    }

    success(msg) {
        console.log("SUCCESS: ", msg);
    }
    failure(msg) {
        console.log("FAILURE: ", msg);
    }



}
