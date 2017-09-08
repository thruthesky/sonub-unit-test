import { Sonub } from '../sonub';

let sonub = new Sonub();
let cio = sonub.cio;

sonub.open().then(html => {
    const $html = cio.load(html)('html');
    let title = $html.find('title').text();
    sonub.isTrue(title == 'Sonub', 'title check.');
});