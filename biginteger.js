/*
	JavaScript BigInteger library version 0.9.1
	http://silentmatt.com/biginteger/

	Copyright (c) 2009 Matthew Crumley <email@matthewcrumley.com>
	Copyright (c) 2010,2011 by John Tobey <John.Tobey@gmail.com>
	Licensed under the MIT license.

	Support for arbitrary internal representation base was added by
	Vitaly Magerya.
*/

/*
	File: biginteger.js

	Exports:

		<BigInteger>
*/
(function(exports) {

try {
  eval('0n');
  exports.BigInteger = require('./lib/impl/native').BigInteger;
} catch (ex) {
  exports.BigInteger = require('./lib/impl/array').BigInteger;
}

})(typeof exports !== 'undefined' ? exports : this);
