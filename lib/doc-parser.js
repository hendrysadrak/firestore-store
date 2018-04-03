class DocParser {
	static read( doc ) {
		return JSON.parse( doc.session );
	}

	static save( doc ) {
		return { session: JSON.stringify( doc ) };
	}
}

module.exports = DocParser;
