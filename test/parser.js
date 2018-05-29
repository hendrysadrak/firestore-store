import test from 'ava';
import DocParser from '../lib/doc-parser';


test( 'default parser save', t => {
	const content = DocParser.save( { hello: 'world', content: 'yay' } );

	t.deepEqual( content, { session: `{"hello":"world","content":"yay"}` } );
} );

test( 'default parser read', t => {
	const content = DocParser.read( { session: `{"hello":"world","content":"yay"}` } );

	t.deepEqual( content, { hello: 'world', content: 'yay' } );
} );
