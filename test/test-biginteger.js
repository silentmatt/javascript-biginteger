var DefaultBigInteger = require("../biginteger").BigInteger;
var ArrayBigInteger = require("../lib/impl/array").BigInteger;

var test = require("./test");
var fs = require('fs');

var assertEquals = test.assertEquals;
var assertArrayEquals = test.assertArrayEquals;
var assertTrue = test.assertTrue;
var assertThrows = test.assertThrows;
var assertPropertyExists = test.assertPropertyExists;
var runTests = test.runTests;

function checkArrayBigInteger(n, d, s) {
	assertPropertyExists(n, "_d");
	assertPropertyExists(n, "_s");

	var sign = n._s;
	var digits = n._d;

	if (sign === 0) {
		assertTrue(digits.length === 0, "sign is zero, but array length is " + digits.length + ": " + JSON.stringify(n));
	}
	if (digits.length === 0) {
		assertTrue(sign === 0, "array length is zero, but sign is " + sign);
	}
	assertTrue(sign === 0 || sign === 1 || sign === -1, "sign is not one of {-1, 0, 1}: " + sign);

	assertTrue(digits.length >= 0, "invalid digits array");
	if (digits.length > 0) {
		assertTrue(digits[digits.length - 1], "leading zero");
	}

	if (d) {
		assertArrayEquals(d, digits);
	}
	if (s) {
		assertEquals(s, sign);
	}
}

function checkNativeBigInteger(n, d, s) {
	assertPropertyExists(n, "value");

	var sign = n.sign();
	var digits = n.value.toString().replace(/^-/, '');

	assertTrue(sign === 0 || sign === 1 || sign === -1, "sign is not one of {-1, 0, 1}: " + sign);

	assertTrue(digits.length > 0, "invalid value");

	if (d != null) {
		assertEquals(d, digits);
	}
	if (s != null) {
		assertEquals(s, sign);
	}
}

function assertBigIntegerEquals(actual, expected) {
	if (Array.isArray(expected)) {
		for (var i = 0; i < expected.length; i++) {
			assertBigIntegerEquals(actual[i], expected[i]);
		}
	}
	else {
		expected = BigInteger(expected);
		if (actual instanceof ArrayBigInteger) {
			checkArrayBigInteger(actual, expected._d, expected._s);
		} else {
			checkNativeBigInteger(actual, expected.value.toString().replace(/^-/, ''), expected.sign());
		}
	}
}

function testArrayConstructor() {
	var n = ArrayBigInteger._construct([], 1);
	checkArrayBigInteger(n, [], 0);

	n = ArrayBigInteger._construct([0,0,0], 1);
	checkArrayBigInteger(n, [], 0);

	n = ArrayBigInteger._construct([1], 1);
	checkArrayBigInteger(n, [1], 1);

	n = ArrayBigInteger._construct([2,0], 1);
	checkArrayBigInteger(n, [2], 1);

	n = ArrayBigInteger._construct([3], 0);
	checkArrayBigInteger(n, [3], 1);

	n = ArrayBigInteger._construct([4], -1);
	checkArrayBigInteger(n, [4], -1);

	n = ArrayBigInteger._construct([1,2,3], -1);
	checkArrayBigInteger(n, [1,2,3], -1);

	var a = [3,2,1];
	n = ArrayBigInteger._construct(a, 1);
	a.unshift(4);
	checkArrayBigInteger(n, [4,3,2,1], 1);
};

function testNativeConstructor() {
	var n = BigInteger._construct(BigInt(0), 1);
	checkNativeBigInteger(n, '0', 0);

	n = BigInteger._construct(BigInt('000'), 1);
	checkNativeBigInteger(n, '0', 0);

	n = BigInteger._construct(BigInt(1), 1);
	checkNativeBigInteger(n, '1', 1);

	n = BigInteger._construct('02', 1);
	checkNativeBigInteger(n, '2', 1);

	n = BigInteger._construct(BigInt('3'), 0);
	checkNativeBigInteger(n, '3', 1);

	n = BigInteger._construct(BigInt(4), -1);
	checkNativeBigInteger(n, '4', -1);

	n = BigInteger._construct(BigInt('123'), -1);
	checkNativeBigInteger(n, '123', -1);
};

function testArrayConversion() {
	var n = ArrayBigInteger(-1);
	checkArrayBigInteger(n, [1], -1);

	var n = ArrayBigInteger(-123);
	checkArrayBigInteger(n, [123], -1);

	var n = ArrayBigInteger(4567);
	checkArrayBigInteger(n, [4567], 1);

	var n = ArrayBigInteger("+42");
	checkArrayBigInteger(n, [42], 1);

	var n = ArrayBigInteger("23x10^5");
	checkArrayBigInteger(n, BigInteger.base_log10 === 7 ? [2300000] : [0, 230], 1);

	var n = ArrayBigInteger("3425 x 10 ^ -2");
	checkArrayBigInteger(n, [34], 1);

	var n = ArrayBigInteger("342.5 x 10 ^ -2");
	checkArrayBigInteger(n, [3], 1);

	var n = ArrayBigInteger("-23x10^5");
	checkArrayBigInteger(n, BigInteger.base_log10 === 7 ? [2300000] : [0, 230], -1);

	var n = ArrayBigInteger("-3425 x 10 ^ -2");
	checkArrayBigInteger(n, [34], -1);

	var n = ArrayBigInteger("23.45x10^5");
	checkArrayBigInteger(n, BigInteger.base_log10 === 7 ? [2345000] : [5000, 234], 1);

	var n = ArrayBigInteger("3425e-12");
	checkArrayBigInteger(n, [], 0);

	var n = ArrayBigInteger("-3425e8");
	checkArrayBigInteger(n, BigInteger.base_log10 === 7 ? [0, 34250] : [0, 0, 3425], -1);

	var n = ArrayBigInteger("3425e-12");
	checkArrayBigInteger(n, [], 0);

	var n = ArrayBigInteger("+3425e0");
	checkArrayBigInteger(n, [3425], 1);

	var n = ArrayBigInteger("0xDeadBeef");
	checkArrayBigInteger(n, BigInteger.base_log10 === 7 ? [5928559, 373] : [8559, 3592, 37], 1);

	var n = ArrayBigInteger("-0c715");
	checkArrayBigInteger(n, [461], -1);

	var n = ArrayBigInteger("+0b1101");
	checkArrayBigInteger(n, [13], 1);
};

function testNativeConversion() {
	var n = BigInteger(-1);
	checkNativeBigInteger(n, '1', -1);

	var n = BigInteger(-123);
	checkNativeBigInteger(n, '123', -1);

	var n = BigInteger(4567);
	checkNativeBigInteger(n, '4567', 1);

	var n = BigInteger("+42");
	checkNativeBigInteger(n, '42', 1);

	var n = BigInteger("23x10^5");
	checkNativeBigInteger(n, '2300000', 1);

	var n = BigInteger("3425 x 10 ^ -2");
	checkNativeBigInteger(n, '34', 1);

	var n = BigInteger("342.5 x 10 ^ -2");
	checkNativeBigInteger(n, '3', 1);

	var n = BigInteger("-23x10^5");
	checkNativeBigInteger(n, '2300000', -1);

	var n = BigInteger("-3425 x 10 ^ -2");
	checkNativeBigInteger(n, '34', -1);

	var n = BigInteger("23.45x10^5");
	checkNativeBigInteger(n, '2345000', 1);

	var n = BigInteger("3425e-12");
	checkNativeBigInteger(n, '0', 0);

	var n = BigInteger("-3425e8");
	checkNativeBigInteger(n, '342500000000', -1);

	var n = BigInteger("3425e-12");
	checkNativeBigInteger(n, '0', 0);

	var n = BigInteger("+3425e0");
	checkNativeBigInteger(n, '3425', 1);

	var n = BigInteger("0xDeadBeef");
	checkNativeBigInteger(n, '3735928559', 1);

	var n = BigInteger("-0c715");
	checkNativeBigInteger(n, '461', -1);

	var n = BigInteger("+0b1101");
	checkNativeBigInteger(n, '13', 1);
};

function testArrayParse() {
	var n;
	n = ArrayBigInteger.parse("0", 10);
	checkArrayBigInteger(n, [], 0);

	n = ArrayBigInteger.parse("");
	checkArrayBigInteger(n, [], 0);

	n = ArrayBigInteger.parse("1");
	checkArrayBigInteger(n, [1], 1);

	n = ArrayBigInteger.parse("-1");
	checkArrayBigInteger(n, [1], -1);

	n = ArrayBigInteger.parse("+42", 10);
	checkArrayBigInteger(n, [42], 1);

	n = ArrayBigInteger.parse("+42", 5);
	checkArrayBigInteger(n, [22], 1);

	n = ArrayBigInteger.parse("23x10^5");
	checkArrayBigInteger(n, ArrayBigInteger.base_log10 === 7 ? [2300000] : [0, 230], 1);

	n = ArrayBigInteger.parse("3425 x 10 ^ -2");
	checkArrayBigInteger(n, [34], 1);

	n = ArrayBigInteger.parse("342.5 x 10 ^ -2");
	checkArrayBigInteger(n, [3], 1);

	n = ArrayBigInteger.parse("-23x10^5");
	checkArrayBigInteger(n, ArrayBigInteger.base_log10 === 7 ? [2300000] : [0, 230], -1);

	n = ArrayBigInteger.parse("-3425 x 10 ^ -2");
	checkArrayBigInteger(n, [34], -1);

	n = ArrayBigInteger.parse("23.45x10^5");
	checkArrayBigInteger(n, ArrayBigInteger.base_log10 === 7 ? [2345000] : [5000, 234], 1);

	n = ArrayBigInteger.parse("3425e-12");
	checkArrayBigInteger(n, [], 0);

	n = ArrayBigInteger.parse("-3425e8");
	checkArrayBigInteger(n, ArrayBigInteger.base_log10 === 7 ? [0, 34250] : [0,0,3425], -1);

	n = ArrayBigInteger.parse("-3425e-12");
	checkArrayBigInteger(n, [], 0);

	n = ArrayBigInteger.parse("+3425e0");
	checkArrayBigInteger(n, [3425], 1);

	n = ArrayBigInteger.parse("0xDeadBeef");
	checkArrayBigInteger(n, ArrayBigInteger.base_log10 === 7 ? [5928559, 373] : [8559, 3592, 37], 1);

	n = ArrayBigInteger.parse("12abz", 36);
	checkArrayBigInteger(n, ArrayBigInteger.base_log10 === 7 ? [1786319] : [6319, 178], 1);

	n = ArrayBigInteger.parse("-0c715");
	checkArrayBigInteger(n, [461], -1);

	n = ArrayBigInteger.parse("+0b1101");
	checkArrayBigInteger(n, [13], 1);

	n = ArrayBigInteger.parse("1011", 2);
	checkArrayBigInteger(n, [11], 1);

	n = ArrayBigInteger.parse("1011", 3);
	checkArrayBigInteger(n, [31], 1);

	n = ArrayBigInteger.parse("1011", 4);
	checkArrayBigInteger(n, [69], 1);

	n = ArrayBigInteger.parse("1011", 5);
	checkArrayBigInteger(n, [131], 1);

	n = ArrayBigInteger.parse("1011", 6);
	checkArrayBigInteger(n, [223], 1);

	n = ArrayBigInteger.parse("1011", 7);
	checkArrayBigInteger(n, [351], 1);

	n = ArrayBigInteger.parse("1011", 10);
	checkArrayBigInteger(n, [1011], 1);

	n = ArrayBigInteger.parse("1011", 11);
	checkArrayBigInteger(n, [1343], 1);

	n = ArrayBigInteger.parse("1011", 12);
	checkArrayBigInteger(n, [1741], 1);

	n = ArrayBigInteger.parse("1011", 15);
	checkArrayBigInteger(n, [3391], 1);

	n = ArrayBigInteger.parse("1011", 16);
	checkArrayBigInteger(n, [4113], 1);

	n = ArrayBigInteger.parse("1011", 36);
	checkArrayBigInteger(n, ArrayBigInteger.base_log10 === 7 ? [46693] : [6693, 4], 1);

	n = ArrayBigInteger.parse("0b", 16);
	checkArrayBigInteger(n, [11], 1);

	n = ArrayBigInteger.parse("0c", 16);
	checkArrayBigInteger(n, [12], 1);

	n = ArrayBigInteger.parse("0b12", 16);
	checkArrayBigInteger(n, [2834], 1);

	n = ArrayBigInteger.parse("0c12", 16);
	checkArrayBigInteger(n, [3090], 1);

	n = ArrayBigInteger.parse("0b101", 2);
	checkArrayBigInteger(n, [5], 1);

	n = ArrayBigInteger.parse("0c101", 8);
	checkArrayBigInteger(n, [65], 1);

	n = ArrayBigInteger.parse("0x101", 16);
	checkArrayBigInteger(n, [257], 1);

	ArrayBigInteger.parse("1", 2);
	ArrayBigInteger.parse("2", 3);
	ArrayBigInteger.parse("3", 4);
	ArrayBigInteger.parse("4", 5);
	ArrayBigInteger.parse("5", 6);
	ArrayBigInteger.parse("6", 7);
	ArrayBigInteger.parse("7", 8);
	ArrayBigInteger.parse("8", 9);
	ArrayBigInteger.parse("9", 10);

	ArrayBigInteger.parse("a", 11);
	ArrayBigInteger.parse("b", 12);
	ArrayBigInteger.parse("c", 13);
	ArrayBigInteger.parse("d", 14);
	ArrayBigInteger.parse("e", 15);
	ArrayBigInteger.parse("f", 16);
	ArrayBigInteger.parse("g", 17);
	ArrayBigInteger.parse("h", 18);
	ArrayBigInteger.parse("i", 19);
	ArrayBigInteger.parse("j", 20);

	ArrayBigInteger.parse("k", 21);
	ArrayBigInteger.parse("l", 22);
	ArrayBigInteger.parse("m", 23);
	ArrayBigInteger.parse("n", 24);
	ArrayBigInteger.parse("o", 25);
	ArrayBigInteger.parse("p", 26);
	ArrayBigInteger.parse("q", 27);
	ArrayBigInteger.parse("r", 28);
	ArrayBigInteger.parse("s", 29);
	ArrayBigInteger.parse("t", 30);

	ArrayBigInteger.parse("u", 31);
	ArrayBigInteger.parse("v", 32);
	ArrayBigInteger.parse("w", 33);
	ArrayBigInteger.parse("x", 34);
	ArrayBigInteger.parse("y", 35);
	ArrayBigInteger.parse("z", 36);
};

function testNativeParse() {
	var n;
	n = BigInteger.parse("0", 10);
	checkNativeBigInteger(n, '0', 0);

	n = BigInteger.parse("");
	checkNativeBigInteger(n, '0', 0);

	n = BigInteger.parse("1");
	checkNativeBigInteger(n, '1', 1);

	n = BigInteger.parse("-1");
	checkNativeBigInteger(n, '1', -1);

	n = BigInteger.parse("+42", 10);
	checkNativeBigInteger(n, '42', 1);

	n = BigInteger.parse("+42", 5);
	checkNativeBigInteger(n, '22', 1);

	n = BigInteger.parse("23x10^5");
	checkNativeBigInteger(n, '2300000', 1);

	n = BigInteger.parse("3425 x 10 ^ -2");
	checkNativeBigInteger(n, '34', 1);

	n = BigInteger.parse("342.5 x 10 ^ -2");
	checkNativeBigInteger(n, '3', 1);

	n = BigInteger.parse("-23x10^5");
	checkNativeBigInteger(n, '2300000', -1);

	n = BigInteger.parse("-3425 x 10 ^ -2");
	checkNativeBigInteger(n, '34', -1);

	n = BigInteger.parse("23.45x10^5");
	checkNativeBigInteger(n, '2345000', 1);

	n = BigInteger.parse("3425e-12");
	checkNativeBigInteger(n, '0', 0);

	n = BigInteger.parse("-3425e8");
	checkNativeBigInteger(n, '342500000000', -1);

	n = BigInteger.parse("-3425e-12");
	checkNativeBigInteger(n, '0', 0);

	n = BigInteger.parse("+3425e0");
	checkNativeBigInteger(n, '3425', 1);

	n = BigInteger.parse("0xDeadBeef");
	checkNativeBigInteger(n, '3735928559', 1);

	n = BigInteger.parse("12abz", 36);
	checkNativeBigInteger(n, '1786319', 1);

	n = BigInteger.parse("-0c715");
	checkNativeBigInteger(n, '461', -1);

	n = BigInteger.parse("+0b1101");
	checkNativeBigInteger(n, '13', 1);

	n = BigInteger.parse("1011", 2);
	checkNativeBigInteger(n, '11', 1);

	n = BigInteger.parse("1011", 3);
	checkNativeBigInteger(n, '31', 1);

	n = BigInteger.parse("1011", 4);
	checkNativeBigInteger(n, '69', 1);

	n = BigInteger.parse("1011", 5);
	checkNativeBigInteger(n, '131', 1);

	n = BigInteger.parse("1011", 6);
	checkNativeBigInteger(n, '223', 1);

	n = BigInteger.parse("1011", 7);
	checkNativeBigInteger(n, '351', 1);

	n = BigInteger.parse("1011", 10);
	checkNativeBigInteger(n, '1011', 1);

	n = BigInteger.parse("1011", 11);
	checkNativeBigInteger(n, '1343', 1);

	n = BigInteger.parse("1011", 12);
	checkNativeBigInteger(n, '1741', 1);

	n = BigInteger.parse("1011", 15);
	checkNativeBigInteger(n, '3391', 1);

	n = BigInteger.parse("1011", 16);
	checkNativeBigInteger(n, '4113', 1);

	n = BigInteger.parse("1011", 36);
	checkNativeBigInteger(n, '46693', 1);

	n = BigInteger.parse("0b", 16);
	checkNativeBigInteger(n, '11', 1);

	n = BigInteger.parse("0c", 16);
	checkNativeBigInteger(n, '12', 1);

	n = BigInteger.parse("0b12", 16);
	checkNativeBigInteger(n, '2834', 1);

	n = BigInteger.parse("0c12", 16);
	checkNativeBigInteger(n, '3090', 1);

	n = BigInteger.parse("0b101", 2);
	checkNativeBigInteger(n, '5', 1);

	n = BigInteger.parse("0c101", 8);
	checkNativeBigInteger(n, '65', 1);

	n = BigInteger.parse("0x101", 16);
	checkNativeBigInteger(n, '257', 1);

	BigInteger.parse("1", 2);
	BigInteger.parse("2", 3);
	BigInteger.parse("3", 4);
	BigInteger.parse("4", 5);
	BigInteger.parse("5", 6);
	BigInteger.parse("6", 7);
	BigInteger.parse("7", 8);
	BigInteger.parse("8", 9);
	BigInteger.parse("9", 10);

	BigInteger.parse("a", 11);
	BigInteger.parse("b", 12);
	BigInteger.parse("c", 13);
	BigInteger.parse("d", 14);
	BigInteger.parse("e", 15);
	BigInteger.parse("f", 16);
	BigInteger.parse("g", 17);
	BigInteger.parse("h", 18);
	BigInteger.parse("i", 19);
	BigInteger.parse("j", 20);

	BigInteger.parse("k", 21);
	BigInteger.parse("l", 22);
	BigInteger.parse("m", 23);
	BigInteger.parse("n", 24);
	BigInteger.parse("o", 25);
	BigInteger.parse("p", 26);
	BigInteger.parse("q", 27);
	BigInteger.parse("r", 28);
	BigInteger.parse("s", 29);
	BigInteger.parse("t", 30);

	BigInteger.parse("u", 31);
	BigInteger.parse("v", 32);
	BigInteger.parse("w", 33);
	BigInteger.parse("x", 34);
	BigInteger.parse("y", 35);
	BigInteger.parse("z", 36);
};

function testArrayParseFail() {
	function createTest(s, radix) {
		if (arguments.length < 2) {
			radix = 10;
		}
		return function() { ArrayBigInteger.parse(s, radix); };
	}

	var radixError  = /^Illegal radix \d+./;
	var digitError  = /^Bad digit for radix \d+/;
	var formatError = /^Invalid BigInteger format: /;

	assertThrows(createTest("0", 1), radixError);
	assertThrows(createTest("0", 37), radixError);

	assertThrows(createTest("+ 42", 10), formatError);
	assertThrows(createTest("3425 x 10 ^ - 2"), formatError);
	assertThrows(createTest("34e-2", 16), formatError);
	assertThrows(createTest("- 23x10^5"), formatError);
	assertThrows(createTest("-+3425"), formatError);
	assertThrows(createTest("3425e-"), formatError);
	assertThrows(createTest("52", 5), digitError);
	assertThrows(createTest("23a105"), digitError);
	assertThrows(createTest("DeadBeef", 15), digitError);
	assertThrows(createTest("-0C715", 10), digitError);
	assertThrows(createTest("-0x715", 10), digitError);
	assertThrows(createTest("-0b715", 10), digitError);
	assertThrows(createTest("-0x715", 8), digitError);
	assertThrows(createTest("-0b715", 8), digitError);
	assertThrows(createTest("-0C715", 2), digitError);
	assertThrows(createTest("-0x715", 2), digitError);

	assertThrows(createTest("2", 2), digitError);
	assertThrows(createTest("3", 3), digitError);
	assertThrows(createTest("4", 4), digitError);
	assertThrows(createTest("5", 5), digitError);
	assertThrows(createTest("6", 6), digitError);
	assertThrows(createTest("7", 7), digitError);
	assertThrows(createTest("8", 8), digitError);
	assertThrows(createTest("9", 9), digitError);
	assertThrows(createTest("a", 10), digitError);
	assertThrows(createTest("b", 11), digitError);
	assertThrows(createTest("c", 12), digitError);
	assertThrows(createTest("d", 13), digitError);
	assertThrows(createTest("e", 14), digitError);
	assertThrows(createTest("f", 15), digitError);
	assertThrows(createTest("g", 16), digitError);
	assertThrows(createTest("h", 17), digitError);
	assertThrows(createTest("i", 18), digitError);
	assertThrows(createTest("j", 19), digitError);
	assertThrows(createTest("k", 20), digitError);
	assertThrows(createTest("l", 21), digitError);
	assertThrows(createTest("m", 22), digitError);
	assertThrows(createTest("n", 23), digitError);
	assertThrows(createTest("o", 24), digitError);
	assertThrows(createTest("p", 25), digitError);
	assertThrows(createTest("q", 26), digitError);
	assertThrows(createTest("r", 27), digitError);
	assertThrows(createTest("s", 28), digitError);
	assertThrows(createTest("t", 29), digitError);
	assertThrows(createTest("u", 30), digitError);
	assertThrows(createTest("v", 31), digitError);
	assertThrows(createTest("w", 32), digitError);
	assertThrows(createTest("x", 33), digitError);
	assertThrows(createTest("y", 34), digitError);
	assertThrows(createTest("z", 35), digitError);
};

function testNativeParseFail() {
	function createTest(s, radix) {
		if (arguments.length < 2) {
			radix = 10;
		}
		return function() { BigInteger.parse(s, radix); };
	}

	var radixError  = /^Illegal radix \d+./;
	var digitError  = /^Bad digit for radix \d+/;
	var formatError = /^Invalid BigInteger format: /;

	assertThrows(createTest("0", 1), radixError);
	assertThrows(createTest("0", 37), radixError);

	assertThrows(createTest("+ 42", 10), formatError);
	assertThrows(createTest("3425 x 10 ^ - 2"), formatError);
	assertThrows(createTest("34e-2", 16), formatError);
	assertThrows(createTest("- 23x10^5"), formatError);
	assertThrows(createTest("-+3425"), formatError);
	assertThrows(createTest("3425e-"), formatError);
	assertThrows(createTest("52", 5), digitError);
	assertThrows(createTest("23a105"), digitError);
	assertThrows(createTest("DeadBeef", 15), digitError);
	assertThrows(createTest("-0C715", 10), digitError);
	assertThrows(createTest("-0x715", 10), digitError);
	assertThrows(createTest("-0b715", 10), digitError);
	assertThrows(createTest("-0x715", 8), digitError);
	assertThrows(createTest("-0b715", 8), digitError);
	assertThrows(createTest("-0C715", 2), digitError);
	assertThrows(createTest("-0x715", 2), digitError);

	assertThrows(createTest("2", 2), digitError);
	assertThrows(createTest("3", 3), digitError);
	assertThrows(createTest("4", 4), digitError);
	assertThrows(createTest("5", 5), digitError);
	assertThrows(createTest("6", 6), digitError);
	assertThrows(createTest("7", 7), digitError);
	assertThrows(createTest("8", 8), digitError);
	assertThrows(createTest("9", 9), digitError);
	assertThrows(createTest("a", 10), digitError);
	assertThrows(createTest("b", 11), digitError);
	assertThrows(createTest("c", 12), digitError);
	assertThrows(createTest("d", 13), digitError);
	assertThrows(createTest("e", 14), digitError);
	assertThrows(createTest("f", 15), digitError);
	assertThrows(createTest("g", 16), digitError);
	assertThrows(createTest("h", 17), digitError);
	assertThrows(createTest("i", 18), digitError);
	assertThrows(createTest("j", 19), digitError);
	assertThrows(createTest("k", 20), digitError);
	assertThrows(createTest("l", 21), digitError);
	assertThrows(createTest("m", 22), digitError);
	assertThrows(createTest("n", 23), digitError);
	assertThrows(createTest("o", 24), digitError);
	assertThrows(createTest("p", 25), digitError);
	assertThrows(createTest("q", 26), digitError);
	assertThrows(createTest("r", 27), digitError);
	assertThrows(createTest("s", 28), digitError);
	assertThrows(createTest("t", 29), digitError);
	assertThrows(createTest("u", 30), digitError);
	assertThrows(createTest("v", 31), digitError);
	assertThrows(createTest("w", 32), digitError);
	assertThrows(createTest("x", 33), digitError);
	assertThrows(createTest("y", 34), digitError);
	assertThrows(createTest("z", 35), digitError);
};

function testToString() {
	runLines('test-toString.js');
};

function testArrayConstants() {
	assertEquals(37, ArrayBigInteger.small.length);

	checkArrayBigInteger(ArrayBigInteger.small[0], [], 0);
	checkArrayBigInteger(ArrayBigInteger._0, [], 0);
	checkArrayBigInteger(ArrayBigInteger.ZERO, [], 0);
	checkArrayBigInteger(ArrayBigInteger._1, [1], 1);
	checkArrayBigInteger(ArrayBigInteger.ONE, [1], 1);
	checkArrayBigInteger(ArrayBigInteger.M_ONE, [1], -1);

	for (var i = 1; i <= 36; i++) {
		checkArrayBigInteger(ArrayBigInteger.small[i], [i], 1);
	}

	checkArrayBigInteger(ArrayBigInteger.MAX_EXP, null, 1);
};

function testNativeConstants() {
	assertEquals(37, BigInteger.small.length);

	checkNativeBigInteger(BigInteger.small[0], '0', 0);
	checkNativeBigInteger(BigInteger._0, '0', 0);
	checkNativeBigInteger(BigInteger.ZERO, '0', 0);
	checkNativeBigInteger(BigInteger._1, '1', 1);
	checkNativeBigInteger(BigInteger.ONE, '1', 1);
	checkNativeBigInteger(BigInteger.M_ONE, '1', -1);

	for (var i = 1; i <= 36; i++) {
		checkNativeBigInteger(BigInteger.small[i], String(i), 1);
	}

	checkNativeBigInteger(BigInteger.MAX_EXP, null, 1);
};

function testToJSValue() {
	assertEquals(BigInteger._construct([], 1).toJSValue(), 0);
	assertEquals(BigInteger(-1).toJSValue(), -1);
	assertEquals(BigInteger(-123).toJSValue(), -123);
	assertEquals(BigInteger(456).toJSValue(), 456);
	assertEquals(BigInteger("+42").toJSValue(), 42);
	assertEquals(BigInteger("23x10^5").toJSValue(), 2300000);
	assertEquals(BigInteger("342.5 x 10 ^ -2").toJSValue(), 3);
	assertEquals(BigInteger("-23x10^5").toJSValue(), -2300000);
	assertEquals(BigInteger("-3425 x 10 ^ -2").toJSValue(), -34);
	assertEquals(BigInteger("23.45x10^5").toJSValue(), 2345000);
	assertEquals(BigInteger("3425e-12").toJSValue(), 0);
	assertEquals(BigInteger("-3425e8").toJSValue(), -342500000000);
	assertEquals(BigInteger("+3425e0").toJSValue(), 3425);
	assertEquals(BigInteger("0xDeadBeef").toJSValue(), parseInt("DeadBeef", 16));
	assertEquals(BigInteger("-0c715").toJSValue(), parseInt("-715", 8));
	assertEquals(BigInteger("+0b1101").toJSValue(), parseInt("1101", 2));
	assertEquals(BigInteger.parse("+42", 5).toJSValue(), 22);
	assertEquals(BigInteger.parse("+42", 5).toJSValue(), parseInt("42", 5));
	assertEquals(BigInteger.parse("12abz", 36).toJSValue(), parseInt("12ABZ", 36));
	assertEquals(BigInteger.parse("-0C715").toJSValue(), -461);

	runLines('test-toJSValue.js');
};

function testValueOf() {
	assertEquals(BigInteger._construct([], 1).valueOf(), 0);
	assertEquals(BigInteger(-1).valueOf(), -1);
	assertEquals(BigInteger(-123).valueOf(), -123);
	assertEquals(BigInteger(456).valueOf(), 456);
	assertEquals(BigInteger("+42").valueOf(), 42);
	assertEquals(BigInteger("23x10^5").valueOf(), 2300000);
	assertEquals(BigInteger("342.5 x 10 ^ -2").valueOf(), 3);
	assertEquals(BigInteger("-23x10^5").valueOf(), -2300000);
	assertEquals(BigInteger("-3425 x 10 ^ -2").valueOf(), -34);
	assertEquals(BigInteger("23.45x10^5").valueOf(), 2345000);
	assertEquals(BigInteger("3425e-12").valueOf(), 0);
	assertEquals(BigInteger("-3425e8").valueOf(), -342500000000);
	assertEquals(BigInteger("+3425e0").valueOf(), 3425);
	assertEquals(BigInteger("0xDeadBeef").valueOf(), parseInt("DeadBeef", 16));
	assertEquals(BigInteger("-0c715").valueOf(), parseInt("-715", 8));
	assertEquals(BigInteger("+0b1101").valueOf(), parseInt("1101", 2));
	assertEquals(BigInteger.parse("+42", 5).valueOf(), 22);
	assertEquals(BigInteger.parse("+42", 5).valueOf(), parseInt("42", 5));
	assertEquals(BigInteger.parse("12abz", 36).valueOf(), parseInt("12ABZ", 36));
	assertEquals(BigInteger.parse("-0c715").valueOf(), -461);

	runLines('test-valueOf.js');
};

function runLines(filename) {
	var text = fs.readFileSync(filename, 'utf8');
	var lines = text.split('\n');
	lines.forEach(function(line) {
		eval(line);
	});
}

function testAdd() {
	runLines('test-add.js');
};

function testSubtract() {
	runLines('test-subtract.js');
};

function testMultiply() {
	runLines('test-multiply.js');
};

function testDivRem() {
	runLines('test-divide.js');
	runLines('test-divide-errors.js');
};

function testNegate() {
	runLines('test-negate.js');
};

function testNext() {
	runLines('test-next.js');
};

function testPrev() {
	runLines('test-prev.js');
};

function testAbs() {
	runLines('test-abs.js');
};

function testCompareAbs() {
	runLines('test-compareAbs.js');
};

function testCompare() {
	runLines('test-compare.js');
};

function testIsUnit() {
	runLines('test-isUnit.js');
};

function testIsZero() {
	runLines('test-isZero.js');
};

function testIsPositive() {
	runLines('test-isPositive.js');
};

function testIsNegative() {
	runLines('test-isNegative.js');
};

function testSquare() {
	runLines('test-square.js');
};

function testIsEven() {
	runLines('test-isEven.js');
};

function testIsOdd() {
	runLines('test-isOdd.js');
};

function testSign() {
	runLines('test-sign.js');
};

function testExp10() {
	runLines('test-exp10.js');
	runLines('test-exp10-errors.js');
};

function testPow() {
	runLines('test-pow.js');
	runLines('test-pow-errors.js');
};

function testModPow() {
	runLines('test-modPow.js');
	runLines('test-modPow-errors.js');
};


function TestArrayBigInteger() {
	this.start = new Date();
}

TestArrayBigInteger.prototype = {
/* Basic Functions */
	testArrayConstructor: testArrayConstructor,
	testArrayConstants: testArrayConstants,
	testArrayConversion: testArrayConversion,
	testArrayParse: testArrayParse,
	testArrayParseFail: testArrayParseFail,
	testToString: testToString,
	testToJSValue: testToJSValue,
	testValueOf: testValueOf,
/* Unary Functions */
	testNegate: testNegate,
	testNext: testNext,
	testPrev: testPrev,
	testAbs: testAbs,
	testSquare: testSquare,
/* Binary Functions */
	testAdd: testAdd,
	testSubtract: testSubtract,
	testMultiply: testMultiply,
	testDivRem: testDivRem,
	testExp10: testExp10,
/* Slow Binary Functions */
	testPow: testPow,
/* Comparisons/Information */
	testCompareAbs: testCompareAbs,
	testCompare: testCompare,
	testIsUnit: testIsUnit,
	testIsZero: testIsZero,
	testIsPositive: testIsPositive,
	testIsNegative: testIsNegative,
	testIsEven: testIsEven,
	testIsOdd: testIsOdd,
	testSign: testSign,
/* Trinary Functions */
	testModPow: testModPow,

/* Keep track of the time for each test */
	tearDown: function(show) {
		if (show) {
			var end = new Date();
			console.log("        Completed in " + (end - this.start) + "ms");
			this.start = new Date();
		}
	}
};

function TestNativeBigInteger() {
	this.start = new Date();
}

TestNativeBigInteger.prototype = {
/* Basic Functions */
	testNativeConstructor: testNativeConstructor,
	testNativeConstants: testNativeConstants,
	testNativeConversion: testNativeConversion,
	testNativeParse: testNativeParse,
	testNativeParseFail: testNativeParseFail,
	testToString: testToString,
	testToJSValue: testToJSValue,
	testValueOf: testValueOf,
/* Unary Functions */
	testNegate: testNegate,
	testNext: testNext,
	testPrev: testPrev,
	testAbs: testAbs,
	testSquare: testSquare,
/* Binary Functions */
	testAdd: testAdd,
	testSubtract: testSubtract,
	testMultiply: testMultiply,
	testDivRem: testDivRem,
	testExp10: testExp10,
/* Slow Binary Functions */
	testPow: testPow,
/* Comparisons/Information */
	testCompareAbs: testCompareAbs,
	testCompare: testCompare,
	testIsUnit: testIsUnit,
	testIsZero: testIsZero,
	testIsPositive: testIsPositive,
	testIsNegative: testIsNegative,
	testIsEven: testIsEven,
	testIsOdd: testIsOdd,
	testSign: testSign,
/* Trinary Functions */
	testModPow: testModPow,

/* Keep track of the time for each test */
	tearDown: function(show) {
		if (show) {
			var end = new Date();
			console.log("        Completed in " + (end - this.start) + "ms");
			this.start = new Date();
		}
	}
};

var BigInteger = ArrayBigInteger;
runTests(TestArrayBigInteger, +process.argv[2]);

if (DefaultBigInteger !== ArrayBigInteger) {
	BigInteger = DefaultBigInteger;
	runTests(TestNativeBigInteger, +process.argv[2]);
}
