import {SonubNightMare} from './../sonub/nightmare';
import {config} from './../confis';


let defaultOptions = {
    show: true, x: 1024, y: 0, width: 900, height: 1000,
    openDevTools: {mode: ''}
};


class BuyAndSell extends SonubNightMare {

    emailTest = 'unit@test.com';
    passwordTest = "password";

    time = (new Date).getTime();

    product_title = 'prod' + this.time;
    product_description = 'description' + this.time;

    newProduct = 'newProd' + this.time;

    name = "name" + this.time;
    price = '' + Math.ceil(Math.random() * 10000) * 100;
    tag = 'tag' + (new Date).getTime();
    used = '#usedItem' + Math.ceil(Math.random() * 3);
    deliverable = '#deliver' + Math.ceil(Math.random() * 2);
    contact = 'contact' + this.time;

    constructor(defaultOptions) {
        super(defaultOptions);
        // this.firefox();
    }


    async main() {

        let $h = await this.get(config.url);

        await this.test($h.find('title').length == 1, "###### BUY AND SELL CHECKING.... ######");
        await this.test($h.find('.fa.fa-user-plus').length == 1, "user is not log-in");

        await this.openBuyandsell();
        await this.clickWaitTest('#buyandsell-list-create-button', '.error-80005', "User Must log in/register first.");
        await this.closeAlert();

        await this.userLogin( this.emailTest, this.passwordTest );
        await this.openBuyandsell();
        await this.createProduct();
        await this.editProduct();
        await this.searchProduct();
        await this.deleteProduct();
        console.log('END OF BUY AND SELL CHECKING');
    }

    async openBuyandsell() {
        await this.openCommunityPage();
        await this.wait('#community-buyandsell-button');
        await this.clickWaitTest('#community-buyandsell-button', '#buyandsell-list-create-button', "Opening Buy and Sell");
    }

    async createProduct() {

        this.nextAction('##### CREATING BUY AND SELL POST #####');
        await this.clickWaitTest('#buyandsell-list-create-button', '.buyandsell-create-edit-page', 'buy and sell create form.');
        await this.clickWaitTest('.product-submit', '.error-90031', '*Tag is required');
        await this.closeAlert();
        await this.type('#tag', this.tag);
        await this.click(this.used);
        await this.clickWaitTest('.product-submit', '.error-90032', '*Province is required');
        await this.closeAlert();

        await this.waitTest('option[value=Abra]', 'province was loaded');
        await this.select('#province', 'Abra');
        await this.waitTest('select#province[ng-reflect-model=Abra]', 'province changed');

        await this.waitTest('option[value="Abra - Manabo"]', 'city was loaded');
        await this.select('#city', 'Abra - Manabo');
        await this.waitTest('select#city[ng-reflect-model="Abra - Manabo"]', 'city changed');


        await this.click(this.deliverable);
        await this.clickWaitTest('.product-submit', '.error-90033', '*Price is required');
        await this.closeAlert();
        await this.type('#price', this.price);
        await this.clickWaitTest('.product-submit', '.error-90034', '*Title is required');
        await this.closeAlert();
        await this.type('#title', this.product_title);
        await this.clickWaitTest('.product-submit', '.error-90035', '*Description is required');
        await this.closeAlert();
        await this.type('#description', this.product_description);
        await this.clickWaitTest('.product-submit', '.error-90036', '*Contact is required');
        await this.closeAlert();
        await this.type('#contact', this.contact);
        await this.clickWaitTest('.product-submit', '.buyandsell-success', 'buyandsell post success.');
        await this.closeAlert();
    }

    async viewProduct() {
        await this.wait('.buyandsells a');
        let $h = await this.getHtml();
        let $selector = $h.find('.product_title');
        let $eq = 1;
        for (let i = 1; i < $selector.length; i++) {
            if ($selector.eq(i - 1).text() == this.product_title) {
                $eq = i;
                break;
            }
        }
        await this.clickWaitTest(`.buyandsells a:nth-child(${$eq})`, '.fa-pencil', 'Product View Page');
    }

    async editProduct() {
        await this.viewProduct();
        this.nextAction('##### EDITING BUY AND SELL POST #####');
        await this.wait('buy-and-sell-view-page .fa-pencil');
        await this.clickWaitTest('buy-and-sell-view-page .fa-pencil', '#city', 'Product Edit Page');
        // console.log('newTitle:', newProduct);
        await this.type('#title', '');
        await this.type('#title', this.newProduct);
        await this.clickWaitTest('.product-submit', '.buyandsell-success', 'buyandsell update success..');
        await this.closeAlert();
        await this.wait('.buyandsells a');
        await this.searchResult('newProduct edit successs');
    }

    async searchProduct() {

        this.nextAction('##### SEARCHING BUY AND SELL POST #####');
        await this.wait('.search-form input[formcontrolname="tag"]');
        await this.insert('input[formcontrolname="tag"]', this.newProduct);
        await this.waitTest('.search-summary', 'Search form full view');
        await this.searchResult('Title search');

        await this.type('#min', this.price);
        await this.searchResult('Search with Minimum Price');
        await this.type('#max', this.price);
        await this.searchResult('Search with Maximum Price');
        await this.check(this.used);
        await this.searchResult('Search with Used item option');
        await this.check(this.deliverable);
        await this.searchResult('Search with Deliverable Option');

        await this.waitTest('option[value=Abra]', 'province was loaded');
        await this.select('#province', 'Abra');
        await this.searchResult('Search with Province');

        await this.waitTest('option[value="Abra - Manabo"]', 'city was loaded');
        await this.select('#city', 'Abra - Manabo');
        await this.searchResult('Search with City');
    }


    async deleteProduct() {
        await this.viewProduct();
        this.nextAction('##### DELETING BUY AND SELL POST #####');
        await this.wait('buy-and-sell-view-page .fa-trash-o');
        await this.clickWaitTest('.fa-trash-o', '.confirm-modal', 'delete prompt');
        await this.clickWaitTest('.modal-footer button:first-child', '.buyandsells a', 'deleted file');

        await this.wait('.search-form input[formcontrolname="tag"]');
        await this.insert('input[formcontrolname="tag"]', this.newProduct);
        await this.waitTest('.search-summary', 'searching deleted product');
        await this.wait('.no-more-post');
        let $h = await this.getHtml();
        await this.test($h.find('.product_title') == 0, 'Product was deleted properly');

        await this.openBuyandsell();
        await this.wait('.buyandsells a');
        await this.searchResult('New product must not exist', true);
    }

    async searchResult(msg, exist = false) {
        await this.wait(1100);
        await this.wait('.buyandsells a');
        let $h = await this.getHtml();
        let $selector = $h.find('.product_title');
        let $eq = exist;
        for (let i = 0; i < $selector.length; i++) {
            if ($selector.eq(i).text() == this.newProduct) {
                $eq = !exist;
                break;
            }
        }
        await this.test($eq, msg);
    }

}


(new BuyAndSell(defaultOptions)).main();