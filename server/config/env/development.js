'use strict';

var fs = require('fs'),
    dotenv = require('dotenv');
dotenv.load();
try {
    var fbid = process.env.OPENHANGOUTS_FACEBOOK_APP_ID,
        fbsecret = process.env.OPENHANGOUTS_FACEBOOK_APP_SECRET;
}
catch (err){
    console.log('Facebook app identifiers missing in env - please export the right parameters');
    throw new Error();
}

try {
    var key = fs.readFileSync(process.env.NODE_PRIVATEKEY_PATH),
        certificate = fs.readFileSync(process.env.NODE_CERTIFICATE_PATH);
}
catch (err){
    console.log('HTTPS key and/or certificate path missing or not found - please export the right parameters');
    throw new Error();
}

module.exports = {
    key: key,
    cert: certificate,

    db: 'mongodb://localhost/mean-dev',
    app: {
        name: 'MEAN - FullStack JS - Development'
    },
    facebook: {
        clientID: fbid,
        clientSecret: fbsecret,
        callbackURL: 'https://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    }
};
