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
    firstName = 'Name'+ this.time;
    middleName = 'Middle';
    lastName = 'Last';



    newFirstName = 'newName' + this.time;

    fullName = this.firstName + ' ' + this.middleName + ' ' + this.lastName;
    newFullName = this.newFirstName + ' ' + this.middleName + ' ' + this.lastName;

    mobile = this.time;
    address = 'Address ' + this.time;


    gender = '#gender' + Math.ceil(Math.random() * 2);
    randomExperience =  (Math.ceil(Math.random() * 23));
    experience = 0;
    randomProfession = Math.floor(Math.random() * 2);
    profession = ['housemaid', 'driver', 'babysitter' ];
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
        await this.searchJobs();
        await this.deleteJobsAnonymous();

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
        await this.select('#workProfession', this.profession[this.randomProfession]);

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
        await this.viewJobPost( this.fullName );
        await this.clickWaitTest('.fa-pencil', 'select#province[ng-reflect-model="Metro Manila"]', 'JOB Edit page');
        await this.type('#firstName', '');
        await this.type('#firstName', this.newFirstName);

        await this.clickWaitTest('.job-submit', '.errorinput.password', '*anonymous password is required');
        await this.closeAlert();
        await this.type('#password', this.passwordTest);
        await this.clickWaitTest('.job-submit', '.alert-modal', 'Anonymous Job Edit Success' );
        await this.click('.alert-close');
        await this.searchResult('New post was update properly');
    }

    async searchJobs() {
        this.nextAction(`##### SEARCHING JOBS POST BY ANONYMOUS ${this.newFirstName} #####`);
        await this.select('#jobProfession', this.profession[this.randomProfession]);
        await this.waitTest('.search-form', 'Job form search...');
        await this.searchResult('Search by profession');


        await this.waitTest('option[value="Metro Manila"]', 'province was loaded');
        await this.select('#searchByProvince', 'Metro Manila');
        await this.searchResult('Search with Province');

        await this.waitTest('option[value="Metro Manila - Taguig City"]', 'city was loaded');
        await this.select('#city', 'Metro Manila - Taguig City');
        await this.searchResult('Search with City');
        await this.check(this.gender);
        await this.searchResult('Search with Gender');
        await this.select('#experience', this.experience);
        await this.searchResult('Search with experience');
        await this.type('#name', this.newFirstName);
        await this.searchResult('Search With new Name');
    }

    async deleteJobsAnonymous() {
        this.nextAction('##### DELETING JOB POST Anonymous #####');
        await this.viewJobPost( this.newFullName );
    }

    async viewJobPost(product) {
        await this.wait('.jobs .job');
        let $h = await this.getHtml();
        let $selector = $h.find('.full-name');
        let $eq = 1;
        for (let i = 1; i < $selector.length; i++) {
            if ($selector.eq(i - 1).text() == product) {
                $eq = i;
                break;
            }
        }
        await this.clickWaitTest(`.jobs .job:nth-child(${$eq})`, '.fa-pencil', 'JOB View Page ' + product);
    }





    async openJobsPage() {
        await this.openCommunityPage();
        await this.wait('#community-jobs-button');
        await this.clickWaitTest('#community-jobs-button', '#jobs-list-create-button', "Opening Jobs");
    }

    async searchResult(msg, exist = false) {
        await this.wait(1100);
        await this.wait('.jobs .job');
        let $h = await this.getHtml();
        let $selector = $h.find('.full-name');
        let $eq = exist;
        for (let i = 0; i < $selector.length; i++) {
            if ($selector.eq(i).text() == this.newFullName) {
                $eq = !exist;
                break;
            }
        }
        await this.test($eq, msg);
    }




}


(new Jobs(defaultOptions)).main();