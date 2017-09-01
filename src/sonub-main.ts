import { getNightmare } from './nightmare';
import * as t from './test';

const cheerio = require('cheerio');


export class SonubMain {

    nightmare = getNightmare();
    
    constructor() {

    }


    async run() {
        await this.openSonub();
        await this.openLogin();
        await this.openRegister();
    }


    async openSonub() {
        console.log("openSonub()");
        return this.nightmare.goto("https://www.sonub.com")
            .wait(5000)
            .evaluate(() => {
                return document.querySelector('html').innerHTML;                
            })
            .then( html => {
                const $html = cheerio.load( html )('html');
                let title = $html.find('title').text();
                t.isTrue( title == 'Sonub', 'title check.' );
            });
    }

    async openLogin() {
        console.log("openLogin()");
        return this.nightmare.goto("https://www.sonub.com/user/login")
            .evaluate(() => {
                return document.querySelector('html').innerHTML;                
            })
            .then( html => {
                const $html = cheerio.load( html )('html');
                let $page = $html.find('login-page');
                t.isTrue( $page.length === 1, 'login page open test' );
            });
    }

    async openRegister() {

    }



}
