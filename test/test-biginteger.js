load("../biginteger.js");
load("test.js");

function checkBigInteger(n, d, s) {
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

function assertBigIntegerEquals(actual, expected) {
	if (Array.isArray(expected)) {
		for (var i = 0; i < expected.length; i++) {
			assertBigIntegerEquals(actual[i], expected[i]);
		}
	}
	else {
		expected = BigInteger(expected);
		checkBigInteger(actual, expected._d, expected._s);
	}
}

function testConstructor() {
	var n = BigInteger._construct([], 1);
	checkBigInteger(n, [], 0);

	n = BigInteger._construct([0,0,0], 1);
	checkBigInteger(n, [], 0);

	n = BigInteger._construct([1], 1);
	checkBigInteger(n, [1], 1);

	n = BigInteger._construct([2,0], 1);
	checkBigInteger(n, [2], 1);

	n = BigInteger._construct([3], 0);
	checkBigInteger(n, [3], 1);

	n = BigInteger._construct([4], -1);
	checkBigInteger(n, [4], -1);

	n = BigInteger._construct([1,2,3], -1);
	checkBigInteger(n, [1,2,3], -1);

	var a = [3,2,1];
	n = BigInteger._construct(a, 1);
	a.unshift(4);
	checkBigInteger(n, [4,3,2,1], 1);
};

function testConversion() {
	var n = BigInteger(-1);
	checkBigInteger(n, [1], -1);

	var n = BigInteger(-123);
	checkBigInteger(n, [123], -1);

	var n = BigInteger(4567);
	checkBigInteger(n, [4567], 1);

	var n = BigInteger("+42");
	checkBigInteger(n, [42], 1);

	var n = BigInteger("23x10^5");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [2300000] : [0, 230], 1);

	var n = BigInteger("3425 x 10 ^ -2");
	checkBigInteger(n, [34], 1);

	var n = BigInteger("342.5 x 10 ^ -2");
	checkBigInteger(n, [3], 1);

	var n = BigInteger("-23x10^5");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [2300000] : [0, 230], -1);

	var n = BigInteger("-3425 x 10 ^ -2");
	checkBigInteger(n, [34], -1);

	var n = BigInteger("23.45x10^5");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [2345000] : [5000, 234], 1);

	var n = BigInteger("3425e-12");
	checkBigInteger(n, [], 0);

	var n = BigInteger("-3425e8");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [0, 34250] : [0, 0, 3425], -1);

	var n = BigInteger("3425e-12");
	checkBigInteger(n, [], 0);

	var n = BigInteger("+3425e0");
	checkBigInteger(n, [3425], 1);

	var n = BigInteger("0xDeadBeef");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [5928559, 373] : [8559, 3592, 37], 1);

	var n = BigInteger("-0c715");
	checkBigInteger(n, [461], -1);

	var n = BigInteger("+0b1101");
	checkBigInteger(n, [13], 1);
};

function testParse() {
	var n;
	n = BigInteger.parse("0", 10);
	checkBigInteger(n, [], 0);

	n = BigInteger.parse("");
	checkBigInteger(n, [], 0);

	n = BigInteger.parse("1");
	checkBigInteger(n, [1], 1);

	n = BigInteger.parse("-1");
	checkBigInteger(n, [1], -1);

	n = BigInteger.parse("+42", 10);
	checkBigInteger(n, [42], 1);

	n = BigInteger.parse("+42", 5);
	checkBigInteger(n, [22], 1);

	n = BigInteger.parse("23x10^5");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [2300000] : [0, 230], 1);

	n = BigInteger.parse("3425 x 10 ^ -2");
	checkBigInteger(n, [34], 1);

	n = BigInteger.parse("342.5 x 10 ^ -2");
	checkBigInteger(n, [3], 1);

	n = BigInteger.parse("-23x10^5");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [2300000] : [0, 230], -1);

	n = BigInteger.parse("-3425 x 10 ^ -2");
	checkBigInteger(n, [34], -1);

	n = BigInteger.parse("23.45x10^5");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [2345000] : [5000, 234], 1);

	n = BigInteger.parse("3425e-12");
	checkBigInteger(n, [], 0);

	n = BigInteger.parse("-3425e8");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [0, 34250] : [0,0,3425], -1);

	n = BigInteger.parse("-3425e-12");
	checkBigInteger(n, [], 0);

	n = BigInteger.parse("+3425e0");
	checkBigInteger(n, [3425], 1);

	n = BigInteger.parse("0xDeadBeef");
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [5928559, 373] : [8559, 3592, 37], 1);

	n = BigInteger.parse("12abz", 36);
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [1786319] : [6319, 178], 1);

	n = BigInteger.parse("-0c715");
	checkBigInteger(n, [461], -1);

	n = BigInteger.parse("+0b1101");
	checkBigInteger(n, [13], 1);

	n = BigInteger.parse("1011", 2);
	checkBigInteger(n, [11], 1);

	n = BigInteger.parse("1011", 3);
	checkBigInteger(n, [31], 1);

	n = BigInteger.parse("1011", 4);
	checkBigInteger(n, [69], 1);

	n = BigInteger.parse("1011", 5);
	checkBigInteger(n, [131], 1);

	n = BigInteger.parse("1011", 6);
	checkBigInteger(n, [223], 1);

	n = BigInteger.parse("1011", 7);
	checkBigInteger(n, [351], 1);

	n = BigInteger.parse("1011", 10);
	checkBigInteger(n, [1011], 1);

	n = BigInteger.parse("1011", 11);
	checkBigInteger(n, [1343], 1);

	n = BigInteger.parse("1011", 12);
	checkBigInteger(n, [1741], 1);

	n = BigInteger.parse("1011", 15);
	checkBigInteger(n, [3391], 1);

	n = BigInteger.parse("1011", 16);
	checkBigInteger(n, [4113], 1);

	n = BigInteger.parse("1011", 36);
	checkBigInteger(n, BigInteger.base_log10 === 7 ? [46693] : [6693, 4], 1);

	n = BigInteger.parse("0b", 16);
	checkBigInteger(n, [11], 1);

	n = BigInteger.parse("0c", 16);
	checkBigInteger(n, [12], 1);

	n = BigInteger.parse("0b12", 16);
	checkBigInteger(n, [2834], 1);

	n = BigInteger.parse("0c12", 16);
	checkBigInteger(n, [3090], 1);

	n = BigInteger.parse("0b101", 2);
	checkBigInteger(n, [5], 1);

	n = BigInteger.parse("0c101", 8);
	checkBigInteger(n, [65], 1);

	n = BigInteger.parse("0x101", 16);
	checkBigInteger(n, [257], 1);

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

function testParseFail() {
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

function testConstants() {
	assertEquals(37, BigInteger.small.length);

	checkBigInteger(BigInteger.small[0], [], 0);
	checkBigInteger(BigInteger._0, [], 0);
	checkBigInteger(BigInteger.ZERO, [], 0);
	checkBigInteger(BigInteger._1, [1], 1);
	checkBigInteger(BigInteger.ONE, [1], 1);
	checkBigInteger(BigInteger.M_ONE, [1], -1);

	for (var i = 1; i <= 36; i++) {
		checkBigInteger(BigInteger.small[i], [i], 1);
	}

	checkBigInteger(BigInteger.MAX_EXP, null, 1);
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
	var text = readFile(filename);
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


function TestBigInteger() {
	this.start = new Date();
}

TestBigInteger.prototype = {
/* Basic Functions */
	testConstructor: testConstructor,
	testConstants: testConstants,
	testConversion: testConversion,
	testParse: testParse,
	testParseFail: testParseFail,
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
			print("        Completed in " + (end - this.start) + "ms");
			this.start = new Date();
		}
	}
};

runTests(TestBigInteger, +arguments[0]);
