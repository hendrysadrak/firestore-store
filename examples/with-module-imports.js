import express from 'express';
import admin from 'firebase-admin';
import session from 'express-session';
import getFirestoreStore from 'firestore-store';

const FirestoreStore = getFirestoreStore(session);

const app = express();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`server started at http://localhost:${ PORT }`)
});
