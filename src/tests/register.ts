import { config } from './../confis';
import { getNightmare } from '../nightmare';
import * as t from '../test';
const c = require('cheerio');


let url = config.url;

let n = getNightmare();


let temp_email = "temp" + (new Date).getTime() + "@gmail.com";
let temp_password = "temp2@password";


run();

async function run() {

    let html = await n.goto(url + '/user/register')
        .type('#register-email', temp_email)
        .type('#register-password', temp_password)
        .click('#register-submit')
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
        .click('#UpdateButton')
        .wait('.home-form-footer-button')
        .evaluate(() => document.querySelector('html').innerHTML)
        .then(html => html);

    $html = c.load(html)('html');
    console.log('count: ', $html.find('.home-form-footer-button').length);
    t.isTrue($html.find('.home-form-footer-button').length > 0, "Register complete .... !");


}


