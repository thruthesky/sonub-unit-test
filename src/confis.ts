var argv = require('yargs').argv;


export interface _CONFIG {
    url?:string
    defaultOptions?: {}
}

export let config:_CONFIG = <_CONFIG>{
    url: argv.url,
    defaultOptions: {
        show: false, x: 1024, y: 0, width: 600, height: 800,
        openDevTools: {mode: ''}
    }
};





// config['url'] = argv.url;
