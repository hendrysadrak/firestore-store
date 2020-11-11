# firestore-store [![Build Status](https://travis-ci.org/hendrysadrak/firestore-store.svg?branch=master)](https://travis-ci.org/hendrysadrak/firestore-store)

**Firestore session store for Express.js / Connect.**

Source of this library is written in **ES6** but commonjs exports are used. If you have any problems or questions let me know in [issues](https://github.com/hendrysadrak/firestore-store/issues).

- [Installation](#installation)
- [Usage](#usage-with-expressjs--connect)
- [Options](#options)
- [Compatibility](#compatibility)
- [Changelog](https://github.com/hendrysadrak/firestore-store/releases)
- [Examples](/examples)
- [Support](#support)
- [License](#license)

## Installation

`firebase-admin` is a required peer dependency for `firestore-store`.

```bash
npm install firebase-admin firestore-store --save
```

## Usage with Express.js / Connect

Initialize `firebase-admin` firestore database.

```javascript
const admin = require("firebase-admin");

const firebase = admin.initializeApp({
	credential: admin.credential.cert("path/to/serviceAccountCredentials.json"),
	databaseURL: "https://<DATABASE_URL>.firebaseio.com",
});

const database = firebase.firestore();
```

Pass `express-session` to `firestore-store`

```javascript
const session = require("express-session");
const FirestoreStore = require("firestore-store")(session);
```

Pass database reference to the FirestoreStore.

```javascript
express() // or connect
	.use(
		session({
			store: new FirestoreStore({
				database: database,
			}),

			secret: "keyboard cat",
			resave: true,
			saveUninitialized: true,
		})
	);
```

## Usage in Cloud Functions or Cloud Run

When using Firebase Hosting together with Cloud Functions or Cloud Run, cookies are stripped from incoming requests. This would normally prevent the session lookup mechanism from working. However, when using `__session` as the name, the value will be passed through to the app.

```javascript
express() // or connect
	.use(
		session({
			store: new FirestoreStore({
				database: database,
			}),

			name: "__session", // ← required for Cloud Functions / Cloud Run
			secret: "keyboard cat",
			resave: true,
			saveUninitialized: true,
		})
	);
```

Refer to [Using Cookies in the Firebase Documentation on Caching](https://firebase.google.com/docs/hosting/manage-cache#using_cookies)

## Options

```javascript
const store = new FirestoreStore(options);
```

#### options.database (required)

Firestore reference.

#### options.collection (default: 'sessions', optional)

Collection name to use for sessions.

#### options.parser (default: DocParser, optional)

Parser used to save or read session info from session document. If you need custom functionality or want to add more properties you can implement such a parser yourself. Required is to have `read` and `save` methods. Check default parser [DocParser](lib/doc-parser.js)

##### Example of a custom parser adding `dateModified` field:

```javascript
const parser = {
	read(doc) {
		return JSON.parse(doc.session);
	},

	save(doc) {
		return {
			session: JSON.stringify(doc),
			dateModified: Date.now(),
		};
	},
};

const store = new FirestoreStore({ parser });
```

##### Example of a custom parser storing the session in the firestore without stringifying:

> https://github.com/hendrysadrak/firestore-store/issues/57#issue-718419725

```javascript
const parser = {
	read(doc) {
		return doc;
	},

	save(doc) {
		return JSON.parse(JSON.stringify(doc));
	},
};

const store = new FirestoreStore({ parser });
```

## Compatibility

This store implements all the **required, recommended and optional** [methods](https://github.com/expressjs/session#session-store-implementation) of the express-session store.

Currently tested with node.js version 10, 12 & 14. Travis is used for running tests https://travis-ci.org/hendrysadrak/firestore-store

## Support

If you have any problems or questions let me know in [issues](https://github.com/hendrysadrak/firestore-store/issues).

If you see it as a useful library star :star: it on [Github](https://github.com/hendrysadrak/firestore-store) so I know to put more time into supporting it.

## License

MIT License
