const connect = require('connect');
const http = require('http');
const admin = require('firebase-admin');
const session = require('express-session');
const FirestoreStore = require('firestore-store')(session);

const app = connect();

const firebase = admin.initializeApp({
	credential: admin.credential.cert('path/to/serviceAccountCredentials.json'),
	databaseURL: 'https://<DATABASE_URL>.firebaseio.com'
});

const database = firebase.firestore();

app.use(session({
	store: new FirestoreStore({
		database: database
	}),

	secret: 'keyboard cat is awesome',
	resave: true,
	saveUninitialized: true
}));

http.createServer(app).listen(3000);
