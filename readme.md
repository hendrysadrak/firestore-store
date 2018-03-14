# firestore-store

**Firestore session store for Express.js.**

Source of this library is written in **ES6** but commonjs exports are used. If you have any problems or questions let me know in [issues](https://github.com/hendrysadrak/firestore-store/issues).


* [Installation](#installation)
* [Usage](#usage)
* [Options](#options)
* [Compatibility](#compatibility)
* [License](#license)


## Installation

`firebase-admin` is a required peer dependency for `firestore-store`.

```bash
npm install firebase-admin firestore-store --save
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

Pass `express-session` to `firestore-store`

```javascript
const session        = require( 'express-session' );
const FirestoreStore = require( 'firestore-store' )(session);
```

Pass database reference to the FirestoreStore.

```javascript
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

#### options.parser (default: DocParser, optional)

Parser used to save or read session info from session document. If you need custom functionality or want to add more properties you can implement such a parser yourself. Check default parser [DocParser](lib/DocParser.js)


## Compatibility

Currently manualy tested with node.js latest version of 8 & latest version of 9.


## License

MIT License
