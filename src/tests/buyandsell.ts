/**
 * Register => goto buyandsell => create post =>
 *
 */

import { config } from './../confis';
import { getNightmare, Mare } from '../nightmare';
import * as t from '../test';
const c = require('cheerio');

let url = config.url;
let n = getNightmare();
let time = (new Date).getTime();
let name = "tmp" + time;
let temp_email = name + "@gmail.com";
let temp_password = "password";


let product_title = 'prod'+time;
let product_description = 'description'+time;
let price = Math.ceil(Math.random() * 100000);
let tag = 'tag' + (new Date).getTime();
let used =  '#usedItem' + Math.ceil(Math.random() * 3);
let deliverable = '#deliver' + Math.ceil(Math.random() * 2)
let contact = 'contact'+time;

let emailTest = 'unit@test.com';

let $n = new Mare();



run();

async function run() {

    let $h = await $n.html($n.urlHome);

    await $n.test($h.find('title').length == 1, "Site open..");
    await $n.test($h.find('.fa.fa-user-plus').length == 1, "user is not log-in");

    await $n.html($n.urlHome + '/jobs')

    await openBuyandsell();
    await $n.clickWaitTest('#buyandsell-list-create-button', '.error', '.error-8071', "User Must log in/register first.");
    await $n.closeAlert();

    // await userRegister();
    await userLogin();

    await openBuyandsell();
    await $n.clickWaitTest('#buyandsell-list-create-button', '.buyandsell-create-edit-page', '.buyandsell-create-edit-page', 'buy and sell create form.');
    await createProduct();
}

async function userLogin() {
    await $n.type('#register_user_login', emailTest);
    await $n.type('#register_user_pass', temp_password);
    await $n.submitWaitTest( '', '.home-form-footer-button', '.home-form-footer-button', 'Login Success...');
}

async function userRegister() {
    await $n.clickWaitTest('#login-register', '#register-submit', '#register-submit', 'Open Register Page.');
    await $n.type('#register-email', emailTest);
    await $n.type('#register-password', temp_password);
    await $n.clickWaitTest('#register-submit', '.profile-user-photo', '.profile-user-photo', 'Registration Success');
    await $n.clickWaitTest('#skipProfilePicture', '#UpdateButton', 'UpdateButton', 'Registration skip profile upload');
    await $n.type('#name', name);
    await $n.clickWaitTest('#UpdateButton', '.home-form-footer-button', '.home-form-footer-button', 'registration finish.')
}


async function openBuyandsell() {
    await $n.openCommunityPage();
    await $n.wait('#community-buyandsell-button');
    await $n.clickWaitTest('#community-buyandsell-button', '#buyandsell-list-create-button', '#buyandsell-list-create-button', "Opening Buy and Sell");
}

async function createProduct() {
    await $n.type('#tag', tag);
    console.log('used::', used);
    await $n.check(used);
    await $n.select('#province', 'Abra');
    await $n.wait('#city');
    await $n.select('#city', 'Abra - Manabo')
    await $n.check(deliverable);
    console.log('deliveable::', deliverable);
    await $n.type('#price', price);
    console.log('price::', price);
    await $n.type('#title', product_title);
    await $n.type('#description', product_description);
    await $n.type('#contact', contact);


}