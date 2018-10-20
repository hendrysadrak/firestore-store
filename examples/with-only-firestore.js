// https://github.com/googleapis/nodejs-firestore
// This example is for using with @google-cloud/firestore package

const express = require('express');
const session = require('express-session');
const FirestoreStore = require('firestore-store')(session);
const Firestore = require('@google-cloud/firestore');

const app = express();

const firestore = new Firestore({
	projectId: 'YOUR_PROJECT_ID',
	keyFilename: '/path/to/keyfile.json',
});

app.use(session({
	store: new FirestoreStore({
		database: firestore
	}),

	secret: 'keyboard cat is awesome',
	resave: true,
	saveUninitialized: true
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`server started at http://localhost:${ PORT }`)
});
