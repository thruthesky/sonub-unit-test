import { getNightmare } from '../nightmare';
import * as t from '../test';
const c = require('cheerio');


let url = 'https://sonub.com';

let n = getNightmare();


let temp_email = "temp" + (new Date).getTime() + "@gmail.com";
let temp_password = "temp2@password";


run();

async function run() {

    let html = await n.goto(url + '/user/register')
        .type('#user1', temp_email)
        .type('#user_pass', temp_password)
        .click('#registerButton')
        .wait('.profile-user-photo')
        .evaluate(() => document.querySelector('html').innerHTML)
        .then(html => html);



    let $html = c.load(html)('html');

    // console.log("count: ", $html.find('.profile-user-photo').length);

    t.isTrue($html.find('.profile-user-photo').length == 1, "Register with email/password");

    html = await n
        .click('.skip')
        .wait('#name')
        .type('#name', "MyName")
        .wait(3000)
        .click('#UpdateButton')
        .wait(1000)
        .wait('.home-form-footer-button')
        .evaluate(() => document.querySelector('html').innerHTML)
        .then(html => html);

    $html = c.load(html)('html');
    console.log('count: ', $html.find('.home-form-footer-button').length);
    t.isTrue($html.find('.home-form-footer-button').length > 0, "Register complete .... !");


}

