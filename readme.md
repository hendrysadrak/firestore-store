# firestore-store

Firestore session store for Express.js


## Installation

```bash
npm install firebase-admin express-session firestore-store --save
```

## Usage

Initialize `firebase-admin` firestore database. 

```javascript
const admin = require( 'firebase-admin' );

const firebase = admin.initializeApp( {
	credential:  admin.credential.cert( 'path/to/serviceAccountCredentials.json' ),
	databaseURL: 'https://<DATABASE_URL>.firebaseio.com'
} );

const database = firebase.firestore();
```

Pass database reference to the FirestoreStore.

```javascript
const FirestoreStore = require( 'firestore-store' );
const session        = require( 'express-session' );

express()
	.use( session( {
		store:  new FirestoreStore( {
			database: database
		} ),
		
		secret:            'keyboard cat'
		resave:            true,
		saveUninitialized: true
	} ) );
```

## Options

```javascript
const store = new FirestoreStore(options)
```

#### options.database (required)

Firestore reference.

#### options.collection (default: 'sessions', optional)

Collection name to use for sessions.

## License

ISC
