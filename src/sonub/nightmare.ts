import {MyNightmare as Nightmare} from './../nightmare/nightmare';


export class SonubNightMare extends Nightmare {

    constructor(defaultOptions) {
        super(defaultOptions);
    }

    async submit(selector = null) {
        if (selector) return this.click(selector);
        return await this.click('.page-form-submit');
    }

    async submitWaitTest(submit, wait, msg) {
        await this.submit(submit);
        await this.waitTest(wait, msg);
    }

    async testSelector(selector, msg) {
        let $h = await this.getHtml();
        this.test($h.find(selector).length > 0, msg);
    }

    async closeAlert() {
        await this.click('button.alert-close').wait(100).then(a=>a);
    }

    async openMenuPage() {
        await this.clickWaitTest('#header-menu-icon', '#menu-page-header', 'Open menu page. Check menu page header'); // menu page
    }

    async openCommunityPage() {
        await this.openMenuPage();
        await this.clickWaitTest('#menu-community', '#community-header', "Open community page. Checking header.");
    }

    async openAskPage() {
        await this.openCommunityPage();
        await this.clickWaitTest('#community-qna-button', '#post-list-qna', "Open post list page. Qna");
    }


    async userLogin( email, password ) {
        this.nextAction('##### USER LOGIN #####');
        await this.openMenuPage();
        await this.wait('#menu-page-login');
        await this.clickWaitTest('#menu-page-login', 'login-page', 'Login Page' );
        await this.insert('#register_user_login', email);
        await this.insert('#register_user_pass', password);
        await this.submit();
        let loginStatus = await this.waitSelectorExist('.error-42053', '.home-form-header');
        if (loginStatus) {
            await this.closeAlert();
            await this.userRegister( email, password);
        }
    }

    async userRegister(email, password) {
        this.nextAction('##### USER REGISTRATION #####');
        await this.clickWaitTest('#login-register', '#register-submit', 'Open Register Page.');
        await this.type('#register-email',email);
        await this.type('#register-password', password);
        await this.clickWaitTest('#register-submit', '.profile-user-photo', 'Registration Success');
        await this.clickWaitTest('#skipProfilePicture', '#UpdateButton', 'Registration skip profile upload');
        await this.type('#name', email);
        await this.clickWaitTest('#UpdateButton', '.home-form-footer-button', 'registration finish.')
    }


}
