import path from 'path';
import test from 'ava';
import session from 'express-session';
import firestoreStore from '../lib/firestore-store';

// Create firebase session

const admin = require( 'firebase-admin' );

const firebase = admin.initializeApp( {
	credential:  admin.credential.cert( path.join( __dirname, 'testServiceAccountCredentials.json' ) ),
	databaseURL: 'https://firestore-store-tests.firebaseio.com'
} );

const database = firebase.firestore();

// Create session store

const FirestoreStore = firestoreStore( session );

const store = new FirestoreStore( { database } );

// Pre data

const sessName = `ses${Date.now()}`;
const sessVal  = { thisissession: true, date: Date.now(), random: Math.random() };

// Tests

test.serial.cb( 'store clear before', t => {
	store.clear( err => {
		t.is( err, null );

		t.end();
	} );
} );

test.serial.cb( 'store get, set, touch', t => {
	store.set( sessName, sessVal, err => {
		t.is( err, null );

		store.get( sessName, ( err, val ) => {
			t.is( err, null );
			t.deepEqual( val, sessVal );

			store.touch( sessName, sessVal, err => {
				t.is( err, null );
				t.end();
			} );
		} );
	} );
} );

test.serial.cb( 'store length before clear', t => {
	store.length( ( err, len ) => {
		t.is( err, null );
		t.is( len, 1 );

		t.end();
	} );
} );

test.serial.cb( 'store clear', t => {
	store.clear( err => {
		t.is( err, null );

		t.end();
	} );
} );

test.serial.cb( 'store length after clear', t => {
	store.length( ( err, len ) => {
		t.is( err, null );
		t.is( len, 0 );

		t.end();
	} );
} );

test.serial.cb( 'store destory', t => {
	store.set( sessName, sessVal, err => {
		t.is( err, null );

		store.destroy( sessName, err => {
			t.is( err, null );

			store.length( ( err, len ) => {
				t.is( err, null );
				t.is( len, 0 );

				t.end();
			} );
		} );
	} );
} );
