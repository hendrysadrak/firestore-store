const docParser = require( './doc-parser' );

module.exports = expressSession =>
	class FirestoreStore extends expressSession.Store {
		constructor( options ) {
			// Default options
			const _options = Object.assign( {
				collection: 'sessions',
				database:   undefined,
				parser:     docParser
			}, options );

			if ( _options.database === undefined || _options.database.collection === undefined )
				throw new Error( 'options.database is required' );

			if (typeof _options.parser.read !== 'function' || typeof _options.parser.save !== 'function')
				throw new Error( 'options.parser has to have "read" and "save" methods' );

			super();

			this._db     = _options.database;
			this._colRef = this._db.collection( _options.collection );
			this._parser = _options.parser;
		}

		all( cb ) {
			this
				._colRef.get()
				.then( snapshot => {
					const docs = snapshot.docs.map( doc => this._parser.read( doc.data() ) );

					cb( null, docs );
				} )
				.catch( cb );
		}

		destroy( sid, cb ) {
			this
				._colRef.doc( sid )
				.delete()
				.then( () => cb( null ) )
				.catch( cb );
		}

		clear( cb ) {
			this
				._colRef.get()
				.then( snapshot =>
					Promise
						.all( snapshot.docs.map( doc => doc.ref.delete() ) )
						.then( () => cb( null ) ) )
				.catch( cb );
		}

		length( cb ) {
			this
				._colRef.get()
				.then( snapshot => cb( null, snapshot.docs.length ) )
				.catch( cb );
		}

		get( sid, cb ) {
			this
				._colRef.doc( sid )
				.get()
				.then( doc => {
					if ( doc.exists === true ) {
						const session = this._parser.read( doc.data() );

						cb( null, session );
					}
					else {
						cb( null, null );
					}
				} )
				.catch( cb );
		}

		set( sid, session, cb ) {
			const data = this._parser.save( session );

			this
				._colRef.doc( sid )
				.set( data )
				.then( () => cb( null ) )
				.catch( cb );
		}

		touch( sid, session, cb ) {
			this.set( sid, session, cb );
		}
	};
