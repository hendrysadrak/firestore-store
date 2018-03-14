const { Store } = require( 'express-session' );
const DocParser = require( './DocParser' );


class FirestoreStore extends Store {
	constructor( options ) {
		// default options
		const _options = Object.assign( {
			collection: 'sessions',
			database:   undefined,
		}, options );

		super();

		this._db     = _options.database;
		this._colRef = this._db.collection( _options.collection );
	}

	all( callback ) {
		this._colRef
				.get()
				.then( snapshot => {
					const docs = snapshot.docs.map( doc => DocParser.read( doc.data() ) );

					callback( null, docs );
				} )
				.catch( callback );
	}

	destroy( sid, callback ) {
		this._colRef.doc( sid )
				.delete()
				.then( () => callback( null ) )
				.catch( callback );
	}

	clear( callback ) {
		this._colRef
				.get()
				.then( snapshot => {
					return Promise
						.all( snapshot.docs.map( doc => doc.ref.delete() ) )
						.then( () => callback( null ) )
				} )
				.catch( callback );
	}

	length( callback ) {
		this._colRef
				.get()
				.then( snapshot => {
					callback( null, snapshot.docs.length )
				} )
				.catch( callback );
	}

	get( sid, callback ) {
		this._colRef
				.doc( sid )
				.get()
				.then( doc => {
					if ( !doc.exists ) {
						callback( null, null );
					}
					else {
						const session = DocParser.read( doc.data() );

						callback( null, session );
					}
				} )
				.catch( callback );
	}

	set( sid, session, callback ) {
		const data = DocParser.save( session );

		this._colRef
				.doc( sid )
				.set( data )
				.then( ref => callback( null ) )
				.catch( callback )
	}

	touch( sid, session, callback ) {
		this.set( sid, session, callback );
	}
}


module.exports = FirestoreStore;
