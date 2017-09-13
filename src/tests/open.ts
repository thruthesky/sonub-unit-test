/**
 * Opens sonub.com and test all the routes(link) INCLUDING error test.
 * But no login, no registration and no posting/commenting.
 * No write activity.
 * 
 */
import { config } from './../confis';
import { getNightmare, Mare } from '../nightmare';
import * as t from '../test';
const c = require('cheerio');

let url = config.url;
let n = getNightmare();


run();

async function run() {

    let $n = new Mare();
    let $h = await $n.html($n.urlHome);
    $n.test($h.find('title').length == 1, "Site open..");
    $n.test($h.find('#header-menu-icon').length == 1, 'check menu icon');


    await $n.openMenuPage();
    await $n.clickWaitTest('#menu-page-login', '.login-page', '.login-page', 'check login page.' );
    
    await $n.submit();
    await $n.wait('.modal.error');
    await $n.testSelector('.error-42051', 'Empty email');


    await $n.closeAlert();
    await $n.type('#register_user_login', 'abcde');
    await $n.submitWaitTest( '', '.modal.error', '.error-42052', 'Empty password');


    await $n.closeAlert();
    await $n.type('#register_user_pass', 'xxxxxxx');
    await $n.submitWaitTest( '', '.modal.error', '.error-42053', 'No user by that email.');


    await $n.closeAlert();
    await $n.clickWaitTest('#login-register', '#register-submit', '#register-submit', 'Open Register Page.');

    await $n.clickWaitTest('#register-submit', '.error', '.error-8071', 'Register with empty email. Email is required.');
    await $n.closeAlert();
    await $n.type('#register-email', 'admin');
    await $n.clickWaitTest('#register-submit', '.error', '.error-8072', 'Register with empty password. Password is required.');
    await $n.closeAlert();
    await $n.type('#register-password', 'o');
    await $n.submitWaitTest( '', '.modal.error', '.error-40001', 'Email is in use');

    await $n.closeAlert();



    // ask list
    // await $n.clickWaitTest('#header-menu-icon', '#menu-page-header', '#menu-page-header', 'check menu page header' ); // menu page
    await $n.openCommunityPage();
    await $n.openAskPage();

    // ask write
    await $n.click('#post-list-create-button');
    await $n.submit('.post-create-button');
    await $n.submitWaitTest('.post-create-button', '.error', '.error-42052', 'Anonymous post create without password.');
    await $n.closeAlert();
    await $n.click('.post-cancel-button');


    // first post of ask forum
    $h = await $n.html();
    let $p = $h.find('.posts .post:first-child');
    // console.log( $p.find('h2').text());


    await $n.typeEnter('.posts .post:first-child .comment-content', 'hello');
    await $n.waitTest('.error', '.error-80005', 'Creating comment without login');
    await $n.closeAlert();

    // test
    /// like
    /// dislike
    /// reply
    



    
    






    



    // let html = await n.goto(url)
    //     .evaluate(() => document.querySelector('html').innerHTML)
    //     .then(html => html);

    // let $html = c.load(html)('html');

    // console.log("count: ", $html.find('.page').length);

    // t.isTrue($html.find('title').length == 1, "Site open..");



    // t.isTrue($html.find('#header-menu-icon').length == 1, 'check menu icon');

    // html = await n.
    //     click('#header-menu-icon')
    //     .wait('#menu-page-header')
    //     .evaluate(() => document.querySelector('html').innerHTML)
    //     .then(a => a);

    // $html = c.load(html)('html');
    // t.isTrue($html.find('#menu-page-header').length == 1, 'check menu page header..');


    // html = await n
    //     .click('#menu-page-login')
    //     .wait('.login-page')
    //     .evaluate(() => document.querySelector('html').innerHTML)
    //     .then(a => a);
    // $html = c.load(html)('html');
    // t.isTrue($html.find('.login-page').length == 1, 'Login page check...');


    // await checkIf('.error-42051', 'Empty email');

    // await closeAlert();
    // await n.type('#register_user_login', 'abcde');
    // await checkIf('.error-42052', 'Empty password');

    // await closeAlert();
    // await n.type('#register_user_pass', 'xxxxxxx');
    // await checkIf('.error-42053', 'No user by that email.');


    // await closeAlert();
    // await n.click('#login-register');
}


// async function closeAlert() {
//     await n.click('button.alert-close').then();
// }


// async function checkIf(selector, msg) {
//     await n.click('#login-submit');
//     await n.wait('.alert-content-bottom');
//     let doc = await n.evaluate(() => document.querySelector('html').innerHTML).then(a => a);
//     let $html = c.load(doc)('html');
//     t.isTrue($html.find(selector).length == 1, msg);
// }
