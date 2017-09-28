import {SonubNightMare} from './../sonub/nightmare';
import {config} from './../confis';


let defaultOptions = {
    show: true, x: 1024, y: 0, width: 900, height: 1000,
    openDevTools: {mode: ''}
};


class Jobs extends SonubNightMare {

    emailTest = 'unit@test.com';
    passwordTest = "password";

    time = (new Date).getTime();
    firstName = 'Name ' + this.time;
    middleName = 'Middle ' + this.time;
    lastName = 'Last ' + this.time;
    mobile = this.time;
    address = 'Address ' + this.time;


    gender = '#gender' + Math.ceil(Math.random() * 2);
    randomExperience =  (Math.ceil(Math.random() * 23));
    experience = 0;
    randomProfession = Math.floor(Math.random() * 2);
    professon = ['housemaid', 'driver', 'babysitter' ];
    message =  'message ' + this.time;





    constructor(defaultOptions) {
        super(defaultOptions);
        this.experience = this.randomExperience < 4 ? this.randomExperience * 3 : (this.randomExperience - 3) * 12;
    }

    async main() {

        let $h = await this.get(config.url);
        await this.test($h.find('title').length == 1, "###### JOBS CHECKING.... ######");
        await this.test($h.find('.fa.fa-user-plus').length == 1, "user is not log-in");

        await this.openJobsPage();


        await this.createJobsAnonymous();
        await this.editJobsAnonymous();
        // await this.searchJobs();
        // await this.deleteJobsAnonymous();

        // await this.userLogin( this.emailTest, this.passwordTest );
        // await this.createWithUser();
        // await this.editWithUser();
        // await this.searchJobs();
        // await this.deleteWithUser();


        // console.log('END OF BUY AND SELL CHECKING');
    }


    async createJobsAnonymous() {
        this.nextAction('##### CREATING JOB POST #####');

        await this.createJobs();

        await this.clickWaitTest('.job-submit', '.error-42052', '*password is required');
        await this.closeAlert();
        await this.type('#password', this.passwordTest);
        await this.clickWaitTest('.job-submit', '.alert-modal', 'Post Success' );
        await this.click('.alert-close');

    }


    async createJobs() {
        await this.clickWaitTest('#jobs-list-create-button', '.job-create-edit-page', 'Job create page');
        await this.clickWaitTest('.job-submit', '.error-90041', '*First Name is required');
        await this.closeAlert();
        await this.type('#firstName', this.firstName);
        await this.type('#middleName', this.middleName);
        await this.clickWaitTest('.job-submit', '.error-90042', '*Last Name is required');
        await this.closeAlert();
        await this.type('#lastName', this.lastName);
        await this.clickWaitTest('.job-submit', '.error-90043', '*Mobile is required');
        await this.closeAlert();
        await this.type('#mobile', this.mobile);
        await this.clickWaitTest('.job-submit', '.error-90044', '*Address is required');
        await this.closeAlert();
        await this.type('#address', this.address);
        await this.clickWaitTest('.job-submit', '.error-90045', '*Province is required');
        await this.closeAlert();

        await this.check( this.gender);
        await this.select('#workExperience', this.experience);

        await this.waitTest('option[value="Metro Manila"]', 'province was loaded');
        await this.select('#province', 'Metro Manila');
        await this.waitTest('select#province[ng-reflect-model="Metro Manila"]', 'province changed');

        await this.waitTest('option[value="Metro Manila - Taguig City"]', 'city was loaded');
        await this.select('#city', 'Metro Manila - Taguig City');
        await this.waitTest('select#city[ng-reflect-model="Metro Manila - Taguig City"]', 'city changed');

        await this.clickWaitTest('.job-submit', '.error-90046', '*Message is required');
        await this.closeAlert();
        await this.type('#content', this.message);
    }

    async editJobsAnonymous() {
        this.nextAction('##### EDITING JOBS POST BY ANONYMOUS #####');
        await this.viewJobPost();


    }

    async searchJobs() {

    }

    async deleteJobsAnonymous() {

    }

    async viewJobPost() {
        await this.wait('.jobs .job');
        let $h = await this.getHtml();
        let $selector = $h.find('.full-name');
        let $eq = 1;
        for (let i = 1; i < $selector.length; i++) {
            if ($selector.eq(i - 1).text() == this.product_title) {
                $eq = i;
                break;
            }
        }
        await this.clickWaitTest(`.jobs .job:nth-child(${$eq})`, '.fa-pencil', 'JOB View Page');
    }





    async openJobsPage() {
        await this.openCommunityPage();
        await this.wait('#community-jobs-button');
        await this.clickWaitTest('#community-jobs-button', '#jobs-list-create-button', "Opening Jobs");
    }



}


(new Jobs(defaultOptions)).main();