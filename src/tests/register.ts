import {SonubNightMare} from './../sonub/nightmare';
import {config} from './../confis';


let defaultOptions = config.defaultOptions;


class Register extends SonubNightMare {
     temp_email = "temp" + (new Date).getTime() + "@gmail.com";
     temp_password = "temp2@password";

    constructor(defaultOptions) {
        super(defaultOptions);
    }

     async main() {
         console.log('##### USER REGISTRATION ######');

         let $h = await this.get(config.url);
         await this.test($h.find('title').length == 1, "###### JOBS PAGE CHECKING.... ######");
         await this.userLogin( this.temp_email, this.temp_password );
         await this._exit('##### End of Registration #####');
     }
}

(new Register(defaultOptions)).main();





// run();

// async function run() {
//
//     let html = await n.goto(url + '/user/register')
//         .type('#register-email', temp_email)
//         .type('#register-password', temp_password)
//         .click('#register-submit')
//         .wait('.profile-user-photo')
//         .evaluate(() => document.querySelector('html').innerHTML)
//         .then(html => html);
//
//
//
//     let $html = c.load(html)('html');
//
//     // console.log("count: ", $html.find('.profile-user-photo').length);
//
//     t.isTrue($html.find('.profile-user-photo').length == 1, "Register with email/password");
//
//     html = await n
//         .click('.skip')
//         .wait('#name')
//         .type('#name', "MyName")
//         .click('#UpdateButton')
//         .wait('.home-form-footer-button')
//         .evaluate(() => document.querySelector('html').innerHTML)
//         .then(html => html);
//
//     $html = c.load(html)('html');
//     console.log('count: ', $html.find('.home-form-footer-button').length);
//     t.isTrue($html.find('.home-form-footer-button').length > 0, "Register complete .... !");
//
//
//
//     process.exit(0);
//
// }


