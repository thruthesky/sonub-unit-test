/**
 * Opens sonub.com and test all the routes(link) INCLUDING error test.
 * But no login, no registration and no posting/commenting.
 * No write activity.
 * 
 */
import { config } from './../confis';
import { getNightmare } from '../nightmare';
import * as t from '../test';
const c = require('cheerio');

let url = config.url;
let n = getNightmare();


run();

async function run() {

    let html = await n.goto(url)
        .evaluate(() => document.querySelector('html').innerHTML)
        .then(html => html);

    let $html = c.load(html)('html');

    console.log("count: ", $html.find('.page').length);

    t.isTrue($html.find('title').length == 1, "Site open..");



    t.isTrue($html.find('#header-menu-icon').length == 1, 'check menu icon');

    html = await n.
        click('#header-menu-icon')
        .wait('#menu-page-header')
        .evaluate( () => document.querySelector('html').innerHTML)
        .then( a => a );
    
    $html = c.load(html)('html');
    t.isTrue($html.find('#menu-page-header').length == 1, 'check menu page header..');


    html = await n
        .click('#menu-page-login')
        .wait('.login-page')
        .evaluate( () => document.querySelector('html').innerHTML)
        .then( a => a );
    $html = c.load(html)('html');
    t.isTrue( $html.find('.login-page').length == 1, 'Login page check...');

    await checkIf('.error-42051', 'Empty email');

    await closeAlert();
    await n.type('#register_user_login', 'abcde');
    await checkIf('.error-42052', 'Empty password');
   
    await closeAlert();
    await n.type('#register_user_pass', 'xxxxxxx');
    await checkIf('.error-42053', 'No user by that email.');


    await closeAlert();
    await n.click('#login-register');
}


async function closeAlert() {
    await n.click('button.alert-close').then();    
}


async function checkIf(selector, msg) {
    await n.click('#login-submit');
    await n.wait('.alert-content-bottom');
    let doc = await n.evaluate( () => document.querySelector('html').innerHTML).then( a => a);
    let $html = c.load(doc)('html');
    t.isTrue( $html.find(selector).length == 1, msg);

}
