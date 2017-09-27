/**
 * Register => goto buyandsell => create post =>
 *
 */

import {config} from './../confis';
import {getNightmare, Mare} from '../nightmare';
import * as t from '../test';
const c = require('cheerio');

let url = config.url;
let n = getNightmare();
let time = (new Date).getTime();
let name = "tmp" + time;


let product_title = 'prod' + time;
let product_description = 'description' + time;
let price = Math.ceil(Math.random() * 100) * 10000;
let tag = 'tag' + (new Date).getTime();
let used = '#usedItem' + Math.ceil(Math.random() * 3);
let deliverable = '#deliver' + Math.ceil(Math.random() * 2)
let contact = 'contact' + time;

let emailTest = 'unit@test.com';
let passwordTest = "password";


// let newProduct = 'newProd' + time;
let newProduct = 'newProd1506502613358';


let $n = new Mare();


run();

async function run() {

    let $h = await $n.html($n.urlHome);

    await $n.test($h.find('title').length == 1, "Site open..");
    await $n.test($h.find('.fa.fa-user-plus').length == 1, "user is not log-in");

    await openBuyandsell();
    await $n.clickWaitTest('#buyandsell-list-create-button', '.error', '.error-80005', "User Must log in/register first.");
    await $n.closeAlert();

    await userLogin();

    await openBuyandsell();

    // await createProduct();
    // await viewProduct();
    // await editProduct();

    await searchProduct();
}

async function userLogin() {
    await $n.insert('#register_user_login', emailTest);
    await $n.insert('#register_user_pass', passwordTest);
    await $n.submit();
    let loginStatus = await $n.waitSelectorExist('.error-42053', '.home-form-header');
    if (loginStatus) {
        await $n.closeAlert();
        await userRegister();
    }
}

async function userRegister() {
    await $n.clickWaitTest('#login-register', '#register-submit', '#register-submit', 'Open Register Page.');
    await $n.type('#register-email', emailTest);
    await $n.type('#register-password', passwordTest);
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
    await $n.clickWaitTest('#buyandsell-list-create-button', '.buyandsell-create-edit-page', '.buyandsell-create-edit-page', 'buy and sell create form.');
    await $n.clickWaitTest('.product-submit', '.error-90031', '.error-90031', '*Tag is required');
    await $n.closeAlert();
    await $n.type('#tag', tag);
    // console.log('used::', used);
    await $n.click(used);
    await $n.clickWaitTest('.product-submit', '.error-90032', '.error-90032', '*Province is required');
    await $n.closeAlert();

    await $n.waitTest('option[value=Abra]', 'option[value=Abra]', 'province was loaded' );
    await $n.select('#province', 'Abra');
    await $n.waitTest('select#province[ng-reflect-model=Abra]','select#province[ng-reflect-model=Abra]', 'province changed');

    await $n.waitTest('option[value="Abra - Manabo"]', 'option[value="Abra - Manabo"]', 'city was loaded' );
    await $n.select('#city', 'Abra - Manabo');
    await $n.waitTest('select#city[ng-reflect-model="Abra - Manabo"]','select#city[ng-reflect-model="Abra - Manabo"]', 'city changed');


    await $n.click(deliverable);
    // console.log('deliveable::', deliverable);
    await $n.clickWaitTest('.product-submit', '.error-90033', '.error-90033', '*Price is required');
    await $n.closeAlert();
    await $n.type('#price', price);
    // console.log('price::', price);
    await $n.clickWaitTest('.product-submit', '.error-90034', '.error-90034', '*Title is required');
    await $n.closeAlert();
    await $n.type('#title', product_title);
    await $n.clickWaitTest('.product-submit', '.error-90035', '.error-90035', '*Description is required');
    await $n.closeAlert();
    await $n.type('#description', product_description);
    await $n.clickWaitTest('.product-submit', '.error-90036', '.error-90036', '*Contact is required');
    await $n.closeAlert();
    await $n.type('#contact', contact);
    await $n.clickWaitTest('.product-submit', '.modal-dialog', '.buyandsell-success', 'buyandsell post success.');
    await $n.closeAlert();
}

async function viewProduct() {
    await $n.wait('.buyandsells a');
    let $h = await $n.html();
    let $selector = await $h.find('.product_title');
    let eq = 1;
    for (let i = 1; i < $selector.length; i++) {
        if ($selector.eq(i-1).text() == product_title) {
            // console.log('Product Exist: ', product_title);
            eq = i;
            break;
        }
    }
    await $n.clickWaitTest(`.buyandsells a:nth-child(${eq})`, '.fa-pencil', '.buyandsell-view-page', 'Product View Page');
}

async function editProduct() {
    await $n.wait('buy-and-sell-view-page .fa-pencil');
    await $n.clickWaitTest('buy-and-sell-view-page .fa-pencil', '#city', '.buyandsell-create-edit-page', 'Product Edit Page');
    // console.log('newTitle:', newProduct);
    await $n.type('#title', false);
    await $n.type('#title', newProduct);
    await $n.clickWaitTest('.product-submit', '.modal-dialog', '.buyandsell-success', 'buyandsell update success..' );
    await $n.closeAlert();
    await $n.wait('.buyandsells a');
    let $h = await $n.html();
    await $n.test( await $h.find('.product_title').eq(0).text() == newProduct, "Update Success");
}

async function searchProduct() {
    await $n.wait('.search-form input[formcontrolname="tag"]');
    await $n.insert( 'input[formcontrolname="tag"]', newProduct );
    await $n.waitTest('option[value=Abra]', '.search-summary', 'Search form full view' );

    await searchResult( 'Title search');
    await $n.type( '#min', 890000 );
    await searchResult( 'Search with Minimum Price');
    await $n.type( '#max', 890000 );
    await searchResult( 'Search with Maximum Price');
    await $n.check('#usedItem1');
    await searchResult( 'Search with Used item option');
    await $n.check('#deliver1');
    await searchResult( 'Search with Deliverable Option');

    await $n.waitTest('option[value=Abra]', 'option[value=Abra]', 'province was loaded' );
    await $n.select('#province', 'Abra');
    await searchResult( 'Search with Province');

    await $n.waitTest('option[value="Abra - Manabo"]', 'option[value="Abra - Manabo"]', 'city was loaded' );
    await $n.select('#city', 'Abra - Manabo');
    await searchResult( 'Search with City');

    await viewProduct();
    await deleteProduct();
}


async function deleteProduct() {
    await $n.wait('buy-and-sell-view-page .fa-trash-o');
    await $n.clickWaitTest('.fa-trash-o', '.confirm-modal', '.confirm-modal', 'delete prompt' );
    await $n.clickWaitTest('button:first-child', '.buyandsells a', '.buyandsells a', 'deleted file' );
}

async function searchResult(msg) {
    await $n.wait( 1100 );
    await $n.wait('.buyandsells a');
    let $h = await $n.html();
    let $selector = await $h.find('.product_title');
    let eq = false;
    for (let i = 0; i < $selector.length; i++) {
        if ($selector.eq(i).text() == newProduct) {
            eq = true;
            break;
        }
    }
    await $n.test( eq, msg);
}

