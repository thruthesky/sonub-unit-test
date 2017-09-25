let Nightmare = require('nightmare');
const c = require('cheerio');
import { config } from './confis';






let defaultOptions = {
    show: true, x: 1024, y: 0, width: 640,
    openDevTools: { mode: '' }
};



export function getNightmare() {
    return get();
}





export function get() {
    let nightmare = Nightmare(defaultOptions);
    return nightmare;
}



export class Mare {
    nightmare;
    constructor() {
        this.nightmare = get();
    }


    get urlHome() {
        return config.url;
    }

    async html(url = null): Promise<any> {
        if (url) {
            await this.nightmare.goto(config.url);
        }
        let html = await this.nightmare
            .evaluate(() => document.querySelector('html').innerHTML)
            .then(html => html);
        let $html = c.load(html)('html');
        return $html;
    }
    async submit( selector = null ) {
        if ( selector ) return this.nightmare.click(selector);
        return await this.nightmare.click('.page-form-submit');
    }

    test(re, msg = '') {
        if (re === true) this.success(msg);
        else this.failure(msg);
    }

    success(msg) {
        console.log("SUCCESS: ", msg);
    }
    failure(msg) {
        console.log("FAILURE: ", msg);
    }



    click(selector) {
        return this.nightmare.click(selector);
    }
    wait(selector) {
        return this.nightmare.wait(selector);
    }
    type(selector, text) {
        return this.nightmare.type(selector, text);
    }
    enter(selector) {
        return this.nightmare.type(selector, "\x0d");
    }
    check(selector) {
        return this.nightmare.check(selector);
    }
    select(selector,option) {
        return this.nightmare.select(selector, option);
    }


    async typeEnter(selector, text) {
        await this.type(selector, text);
        await this.enter(selector);
    }


    async waitTest( wait, test, msg ) {
        await this.wait(wait);
        let $h = await this.html();
        await this.test($h.find(test).length > 0, msg);
    }
    async clickWaitTest(click, wait, test, msg) {
        await this.click(click);
        await this.waitTest( wait, test, msg );
    }

    async submitWaitTest(submit, wait, test, msg) {
        await this.submit(submit);
        // await this.wait(wait);
        // await this.testSelector(test, msg);
        await this.waitTest( wait, test, msg );
    }
    async testSelector(selector, msg) {
        let $h = await this.html();
        // console.log("title: ", $h.find('title').text());
        // console.log("count: ", $h.find(selector).length);
        this.test($h.find(selector).length > 0, msg);
    }


    async closeAlert() {
        await this.click('button.alert-close').wait(100).then();
    }

    async openMenuPage() {
        await this.clickWaitTest('#header-menu-icon', '#menu-page-header', '#menu-page-header', 'Open menu page. Check menu page header' ); // menu page
    }

    async openCommunityPage() {
        await this.openMenuPage();
        await this.clickWaitTest('#menu-community', '#community-header', '#community-header', "Open community page. Checking header.");
    }
    async openAskPage() {
        await this.openCommunityPage();
        await this.clickWaitTest('#community-qna-button', '#post-list-qna', '#post-list-qna', "Open post list page. Qna");
    }



}