'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');


var fs = require('fs'),
    dotenv = require('dotenv');
dotenv.load();


var key;
var certificate;
try {
   key = fs.readFileSync(process.env.NODE_PRIVATEKEY_PATH);
  certificate = fs.readFileSync(process.env.NODE_CERTIFICATE_PATH);
}
catch (err){
    try {
        key = process.env.NODE_PRIVATEKEY;
        certificate = process.env.NODE_CERTIFICATE;
    }
    catch (err){
        console.log('HTTPS key and/or certificate path missing or not found - please export the right parameters');
        throw new Error();
    }
}

module.exports = {
    key: key,
    cert: certificate,

	root: rootPath,
	port: process.env.PORT || 3000,
	hostname: process.env.HOST || process.env.HOSTNAME,
	db: process.env.MONGOHQ_URL,
	templateEngine: 'swig',

    // The secret should be set to a non-guessable string that
    // is used to compute a session hash
    sessionSecret: 'MEAN',

    // The name of the MongoDB collection to store sessions in
    sessionCollection: 'sessions', 

    // The session cookie settings
    sessionCookie: { 
    	path: '/',
    	httpOnly: true,
    	// If secure is set to true then it will cause the cookie to be set
    	// only when SSL-enabled (HTTPS) is used, and otherwise it won't
    	// set a cookie. 'true' is recommended yet it requires the above
    	// mentioned pre-requisite.
    	secure: false,
    	// Only set the maxAge to null if the cookie shouldn't be expired
    	// at all. The cookie will expunge when the browser is closed.
    	maxAge: null
    },

    // The session cookie name
    sessionName: 'connect.sid'
};
