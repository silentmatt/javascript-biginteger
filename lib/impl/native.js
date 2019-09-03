(function(exports) {
"use strict";

var CONSTRUCT = {}; // Unique token to call "private" version of constructor

function BigInteger(n, token) {
	if (token !== CONSTRUCT) {
		if (n instanceof BigInteger) {
			return n;
		}
		else if (typeof n === "undefined") {
			return ZERO;
		}
		return BigInteger.parse(n);
	}

	this.value = BigInt(n);
}

BigInteger._construct = function(n, s) {
	return new BigInteger(BigInt(n) * (s < 0 ? -1n : 1n), CONSTRUCT);
};

// Base-10 speedup hacks in parse, toString, exp10 and log functions
// require base to be a power of 10. 10^7 is the largest such power
// that won't cause a precision loss when digits are multiplied.
var BigInteger_base = 10000000; // XXX
var BigInteger_base_log10 = 7; // XXX

BigInteger.base = BigInteger_base; // XXX
BigInteger.base_log10 = BigInteger_base_log10; // XXX

var ZERO = new BigInteger(0n, CONSTRUCT);
BigInteger.ZERO = ZERO;

var ONE = new BigInteger(1n, CONSTRUCT);
BigInteger.ONE = ONE;

var M_ONE = new BigInteger(-1n, CONSTRUCT);
BigInteger.M_ONE = M_ONE;

BigInteger._0 = ZERO;

BigInteger._1 = ONE;

BigInteger.small = [
	ZERO,
	ONE,
	/* Assuming BigInteger_base > 36 */
	new BigInteger( 2n, CONSTRUCT),
	new BigInteger( 3n, CONSTRUCT),
	new BigInteger( 4n, CONSTRUCT),
	new BigInteger( 5n, CONSTRUCT),
	new BigInteger( 6n, CONSTRUCT),
	new BigInteger( 7n, CONSTRUCT),
	new BigInteger( 8n, CONSTRUCT),
	new BigInteger( 9n, CONSTRUCT),
	new BigInteger(10n, CONSTRUCT),
	new BigInteger(11n, CONSTRUCT),
	new BigInteger(12n, CONSTRUCT),
	new BigInteger(13n, CONSTRUCT),
	new BigInteger(14n, CONSTRUCT),
	new BigInteger(15n, CONSTRUCT),
	new BigInteger(16n, CONSTRUCT),
	new BigInteger(17n, CONSTRUCT),
	new BigInteger(18n, CONSTRUCT),
	new BigInteger(19n, CONSTRUCT),
	new BigInteger(20n, CONSTRUCT),
	new BigInteger(21n, CONSTRUCT),
	new BigInteger(22n, CONSTRUCT),
	new BigInteger(23n, CONSTRUCT),
	new BigInteger(24n, CONSTRUCT),
	new BigInteger(25n, CONSTRUCT),
	new BigInteger(26n, CONSTRUCT),
	new BigInteger(27n, CONSTRUCT),
	new BigInteger(28n, CONSTRUCT),
	new BigInteger(29n, CONSTRUCT),
	new BigInteger(30n, CONSTRUCT),
	new BigInteger(31n, CONSTRUCT),
	new BigInteger(32n, CONSTRUCT),
	new BigInteger(33n, CONSTRUCT),
	new BigInteger(34n, CONSTRUCT),
	new BigInteger(35n, CONSTRUCT),
	new BigInteger(36n, CONSTRUCT)
];

// Used for parsing/radix conversion
BigInteger.digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

BigInteger.prototype.toString = function(base) {
	base = +base || 10;
	if (base < 2 || base > 36) {
		throw new Error("illegal radix " + base + ".");
	}

	return this.value.toString(base).toUpperCase();
};

// Verify strings for parsing
BigInteger.radixRegex = [
	/^$/,
	/^$/,
	/^[01]*$/,
	/^[012]*$/,
	/^[0-3]*$/,
	/^[0-4]*$/,
	/^[0-5]*$/,
	/^[0-6]*$/,
	/^[0-7]*$/,
	/^[0-8]*$/,
	/^[0-9]*$/,
	/^[0-9aA]*$/,
	/^[0-9abAB]*$/,
	/^[0-9abcABC]*$/,
	/^[0-9a-dA-D]*$/,
	/^[0-9a-eA-E]*$/,
	/^[0-9a-fA-F]*$/,
	/^[0-9a-gA-G]*$/,
	/^[0-9a-hA-H]*$/,
	/^[0-9a-iA-I]*$/,
	/^[0-9a-jA-J]*$/,
	/^[0-9a-kA-K]*$/,
	/^[0-9a-lA-L]*$/,
	/^[0-9a-mA-M]*$/,
	/^[0-9a-nA-N]*$/,
	/^[0-9a-oA-O]*$/,
	/^[0-9a-pA-P]*$/,
	/^[0-9a-qA-Q]*$/,
	/^[0-9a-rA-R]*$/,
	/^[0-9a-sA-S]*$/,
	/^[0-9a-tA-T]*$/,
	/^[0-9a-uA-U]*$/,
	/^[0-9a-vA-V]*$/,
	/^[0-9a-wA-W]*$/,
	/^[0-9a-xA-X]*$/,
	/^[0-9a-yA-Y]*$/,
	/^[0-9a-zA-Z]*$/
];

function pad3(s) {
	if (s.length === 1) {
		return '00' + s;
	} else if (s.length === 2) {
		return '0' + s;
	} else if (s.length === 3) {
		return s;
	} else {
		throw new Error('Unexpected length in pad3(' + s + ')');
	}
}

BigInteger.parse = function(s, base) {
	// Expands a number in exponential form to decimal form.
	// expandExponential("-13.441*10^5") === "1344100";
	// expandExponential("1.12300e-1") === "0.112300";
	// expandExponential(1000000000000000000000000000000) === "1000000000000000000000000000000";
	function expandExponential(str) {
		str = str.replace(/\s*[*xX]\s*10\s*(\^|\*\*)\s*/, "e");

		return str.replace(/^([+\-])?(\d+)\.?(\d*)[eE]([+\-]?\d+)$/, function(x, s, n, f, c) {
			c = +c;
			var l = c < 0;
			var i = n.length + c;
			x = (l ? n : f).length;
			c = ((c = Math.abs(c)) >= x ? c - x + l : 0);
			var z = (new Array(c + 1)).join("0");
			var r = n + f;
			return (s || "") + (l ? r = z + r : r += z).substr(0, i += l ? z.length : 0) + (i < r.length ? "." + r.substr(i) : "");
		});
	}

	s = s.toString();
	if (typeof base === "undefined" || +base === 10) {
		s = expandExponential(s);
	}

	var prefixRE;
	if (typeof base === "undefined") {
		prefixRE = '0[xcb]';
	}
	else if (base == 16) {
		prefixRE = '0x';
	}
	else if (base == 8) {
		prefixRE = '0c';
	}
	else if (base == 2) {
		prefixRE = '0b';
	}
	else {
		prefixRE = '';
	}
	var parts = new RegExp('^([+\\-]?)(' + prefixRE + ')?([0-9a-z]*)(?:\\.\\d*)?$', 'i').exec(s);
	if (parts) {
		var sign = parts[1] || "+";
		var baseSection = parts[2] || "";
		var digits = parts[3] || "";

		if (typeof base === "undefined") {
			// Guess base
			if (baseSection === "0x" || baseSection === "0X") { // Hex
				base = 16;
			}
			else if (baseSection === "0c" || baseSection === "0C") { // Octal
				base = 8;
			}
			else if (baseSection === "0b" || baseSection === "0B") { // Binary
				base = 2;
			}
			else {
				base = 10;
			}
		}
		else if (base < 2 || base > 36) {
			throw new Error("Illegal radix " + base + ".");
		}

		base = +base;

		// Check for digits outside the range
		if (!(BigInteger.radixRegex[base].test(digits))) {
			throw new Error("Bad digit for radix " + base);
		}

		// Strip leading zeros
		digits = digits.replace(/^0+/, "");
		if (digits.length === 0) {
			return ZERO;
		}

		var sgn = sign == '-' ? -1n : 1n;
		if (base == 10) {
			return new BigInteger(sgn * BigInt(digits), CONSTRUCT);
		} else if (base === 2) {
			return new BigInteger(sgn * BigInt('0b' + digits), CONSTRUCT);
		} else if (base === 8) {
			digits = digits.replace(/\d/g, function (digit) {
				return pad3(Number(digit).toString(2));
			});
			return new BigInteger(sgn * BigInt('0b' + digits), CONSTRUCT);
		} else if (base === 16) {
			return new BigInteger(sgn * BigInt('0x' + digits), CONSTRUCT);
		} else {
			// Do the conversion
			var d = 0n;
			base = BigInteger.small[base].value;
			var small = BigInteger.small;
			base = BigInt(base);
			for (var i = 0; i < digits.length; i++) {
				d = (d * base) + small[parseInt(digits[i], 36)].value;
			}
			return new BigInteger(sgn * d, CONSTRUCT);
		}
	}
	else {
		throw new Error("Invalid BigInteger format: " + s);
	}
};

BigInteger.prototype.add = function(n) {
	if (this.isZero()) {
		return BigInteger(n);
	}

	n = BigInteger(n);
	if (n.isZero()) {
		return this;
	}

	return new BigInteger(this.value + n.value, CONSTRUCT);
};

BigInteger.prototype.negate = function() {
	return new BigInteger(-this.value, CONSTRUCT);
};

BigInteger.prototype.abs = function() {
	return (this.value < 0n) ? this.negate() : this;
};

BigInteger.prototype.subtract = function(n) {
	if (this.isZero()) {
		return BigInteger(n).negate();
	}

	n = BigInteger(n);
	if (n.isZero()) {
		return this;
	}

	return new BigInteger(this.value - n.value, CONSTRUCT);
};

BigInteger.prototype.next = function() {
	return this.add(ONE);
};

BigInteger.prototype.prev = function() {
	return this.subtract(ONE);
};

BigInteger.prototype.compareAbs = function(n) {
	if (this === n) {
		return 0;
	}

	if (!(n instanceof BigInteger)) {
		if (!isFinite(n)) {
			return(isNaN(n) ? n : -1);
		}
		n = BigInteger(n);
	}

	var a = this.value < 0 ? -this.value : this.value;
	var b = n.value < 0 ? -n.value : n.value;

	return a < b ? -1 : a > b ? 1 : 0;
};

BigInteger.prototype.compare = function(n) {
	if (this === n) {
		return 0;
	}

	n = BigInteger(n);

	var a = this.value;
	var b = n.value;
	return a < b ? -1 : a > b ? 1 : 0;
};

BigInteger.prototype.isUnit = function() {
	return this.value === 1n || this.value === -1n;
};

BigInteger.prototype.multiply = function(n) {
	if (this.isZero()) {
		return ZERO;
	}

	n = BigInteger(n);
	if (n.isZero() === 0) {
		return ZERO;
	}

	return new BigInteger(this.value * n.value, CONSTRUCT);
};

BigInteger.prototype.multiplySingleDigit = function(n) {
	if (n === 0 || this.isZero()) {
		return ZERO;
	}
	if (n === 1) {
		return this;
	}

	return new BigInteger(this.value * BigInt(n), CONSTRUCT);
};

BigInteger.prototype.square = function() {
	if (this.isZero()) {
		return ZERO;
	}
	if (this.isUnit()) {
		return ONE;
	}

	return new BigInteger(this.value ** 2n, CONSTRUCT);
};

BigInteger.prototype.quotient = function(n) {
	n = BigInteger(n);
	return new BigInteger(this.value / n.value, CONSTRUCT);
};

BigInteger.prototype.divide = BigInteger.prototype.quotient;

BigInteger.prototype.remainder = function(n) {
	n = BigInteger(n);
	return new BigInteger(this.value % n.value, CONSTRUCT);
};

BigInteger.prototype.divRem = function(n) {
	n = BigInteger(n);
	if (n.isZero()) {
		throw new Error("Divide by zero");
	}
	if (this.isZero()) {
		return [ ZERO, ZERO ];
	}

	// Test for easy cases -- |n1| <= |n2|
	switch (this.compareAbs(n)) {
	case 0: // n1 == n2
		return [ this.sign() === n.sign() ? ONE : M_ONE, ZERO ];
	case -1: // |n1| < |n2|
		return [ ZERO, this ];
	}

	return [
		new BigInteger(this.value / n.value, CONSTRUCT),
		new BigInteger(this.value % n.value, CONSTRUCT)
	];
};

// Throws an exception if n is outside of (-BigInteger.base, -1] or
// [1, BigInteger.base).  It's not necessary to call this, since the
// other division functions will call it if they are able to.
BigInteger.prototype.divRemSmall = function(n) {
	var r;
	n = +n;
	if (n === 0) {
		throw new Error("Divide by zero");
	}

	var n_s = n < 0 ? -1 : 1;
	var sign = this.sign() * n_s;
	n = Math.abs(n);

	if (n < 1 || n >= BigInteger_base) {
		throw new Error("Argument out of range");
	}

	if (this.isZero()) {
		return [ ZERO, ZERO ];
	}

	if (n === 1 || n === -1) {
		return [(sign === 1) ? this.abs() : (sign === -1) ? this.negate() : ZERO, ZERO ];
	}

	var bigsign = BigInt(sign);
	var bign = BigInt(n);
	var thisabs = this.abs().value;
	return [
		new BigInteger(bigsign * (thisabs / bign), CONSTRUCT),
		new BigInteger(bigsign * (thisabs % bign), CONSTRUCT)
	];
};

BigInteger.prototype.isEven = function() {
	return (this.value & 1n) === 0n;
};

BigInteger.prototype.isOdd = function() {
	return (this.value & 1n) === 1n;
};

BigInteger.prototype.sign = function() {
	return this.value < 0n ? -1 : this.value > 0n ? 1 : 0;
};

BigInteger.prototype.isPositive = function() {
	return this.value > 0n;
};

BigInteger.prototype.isNegative = function() {
	return this.value < 0n;
};

BigInteger.prototype.isZero = function() {
	return this.value === 0n;
};

BigInteger.prototype.exp10 = function(n) {
	n = +n;
	if (n === 0) {
		return this;
	}
	if (Math.abs(n) > Number(MAX_EXP)) {
		throw new Error("exponent too large in BigInteger.exp10");
	}
	// Optimization for this == 0
	if (this.isZero()) {
		return ZERO;
	}
	if (n > 0) {
		return new BigInteger(this.value * (10n ** BigInt(n)), CONSTRUCT);
	} else {
		var k = new BigInteger(this.value / (10n ** BigInt(-n)), CONSTRUCT);
		return k.isZero() ? ZERO : k;
	}
};

BigInteger.prototype.pow = function(n) {
	if (this.isUnit()) {
		if (this.value > 0n) {
			return this;
		}
		else {
			return BigInteger(n).isOdd() ? this : this.negate();
		}
	}

	n = BigInteger(n);
	if (n.isZero()) {
		return ONE;
	}
	else if (n.value < 0n) {
		if (this.isZero()) {
			throw new Error("Divide by zero");
		}
		else {
			return ZERO;
		}
	}
	if (this.isZero()) {
		return ZERO;
	}
	if (n.isUnit()) {
		return this;
	}

	if (n.compareAbs(MAX_EXP) > 0) {
		throw new Error("exponent too large in BigInteger.pow");
	}

	return new BigInteger(this.value ** n.value, CONSTRUCT);
};

BigInteger.prototype.modPow = function(exponent, modulus) {
	var result = 1n;
	var base = this.value;
	exponent = BigInteger(exponent).value;
	modulus = BigInteger(modulus).value;

	if (modulus === 0n && exponent > 0n) {
		throw new Error("Divide by zero");
	}

	while (exponent > 0n) {
		if (exponent & 1n) {
			result = (result * base) % modulus;
		}

		exponent = exponent >> 1n;
		if (exponent > 0n) {
			base = (base * base) % modulus;
		}
	}

	return new BigInteger(result, CONSTRUCT);
};

BigInteger.prototype.log = function() {
	switch (this.sign()) {
	case 0:	 return -Infinity;
	case -1: return NaN;
	default: // Fall through.
	}

	var digits = this.abs().value.toString();
	var l = digits.length;

	if (l < 30) {
		return Math.log(this.valueOf());
	}

	var N = 30;
	var firstNdigits = digits.slice(0, N);
	return Math.log((new BigInteger(firstNdigits, CONSTRUCT)).valueOf()) + (l - N) * Math.log(10);
};

BigInteger.prototype.valueOf = function() {
	return Number(this.toString());
};

BigInteger.prototype.toJSValue = function() {
	return Number(this.toString());
};

var MAX_EXP = BigInteger(0x7FFFFFFF);
BigInteger.MAX_EXP = MAX_EXP;

(function() {
	function makeUnary(fn) {
		return function(a) {
			return fn.call(BigInteger(a));
		};
	}

	function makeBinary(fn) {
		return function(a, b) {
			return fn.call(BigInteger(a), BigInteger(b));
		};
	}

	function makeTrinary(fn) {
		return function(a, b, c) {
			return fn.call(BigInteger(a), BigInteger(b), BigInteger(c));
		};
	}

	(function() {
		var i, fn;
		var unary = "toJSValue,isEven,isOdd,sign,isZero,isNegative,abs,isUnit,square,negate,isPositive,toString,next,prev,log".split(",");
		var binary = "compare,remainder,divRem,subtract,add,quotient,divide,multiply,pow,compareAbs".split(",");
		var trinary = ["modPow"];

		for (i = 0; i < unary.length; i++) {
			fn = unary[i];
			BigInteger[fn] = makeUnary(BigInteger.prototype[fn]);
		}

		for (i = 0; i < binary.length; i++) {
			fn = binary[i];
			BigInteger[fn] = makeBinary(BigInteger.prototype[fn]);
		}

		for (i = 0; i < trinary.length; i++) {
			fn = trinary[i];
			BigInteger[fn] = makeTrinary(BigInteger.prototype[fn]);
		}

		BigInteger.exp10 = function(x, n) {
			return BigInteger(x).exp10(n);
		};
	})();
})();

exports.BigInteger = BigInteger;
})(typeof exports !== 'undefined' ? exports : this);
