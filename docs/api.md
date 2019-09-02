# API

* [BigInteger Class](#biginteger)
  * Static factories
    * [BigInteger()](#constructor)
    * [BigInteger.parse()](#parse)
  * Constants
    * [BigInteger.ZERO](#zero)
    * [BigInteger.ONE](#one)
    * [BigInteger.M_ONE](#m_one)
    * [BigInteger._0](#biginteger_0)
    * [BigInteger._1](#biginteger_1)
    * [BigInteger.small](#small)
    * [BigInteger.MAX_EXP](#max_exp)
  * Methods
    * [toString()](#tostring)
    * [toJSValue()](#tojsvalue)
    * [add()](#add)
    * [subtract()](#subtract)
    * [multiply()](#multiply)
    * [quotient()](#quotient)
    * [remainder()](#remainder)
    * [divRem()](#divrem)
    * [divide()](#divide)
    * [negate()](#negate)
    * [abs()](#abs)
    * [pow()](#pow)
    * [modPow()](#modpow)
    * [square()](#square)
    * [exp10()](#exp10)
    * [log()](#log)
    * [next()](#next)
    * [prev()](#prev)
    * [compare()](#compare)
    * [compareAbs()](#compareabs)
    * [isUnit()](#isunit)
    * [isEven()](#iseven)
    * [isOdd()](#isodd)
    * [sign()](#sign)
    * [isPositive()](#ispositive)
    * [isNegative()](#isnegative)
    * [isZero()](#iszero)
    * [valueOf()](#valueof)
  * Static functions
    * [BigInteger.toString()](#biginteger_tostring)
    * [BigInteger.toJSValue()](#biginteger_tojsvalue)
    * [BigInteger.add()](#biginteger_add)
    * [BigInteger.subtract()](#biginteger_subtract)
    * [BigInteger.multiply()](#biginteger_multiply)
    * [BigInteger.quotient()](#biginteger_quotient)
    * [BigInteger.remainder()](#biginteger_remainder)
    * [BigInteger.divRem()](#biginteger_divrem)
    * [BigInteger.divide()](#biginteger_divide)
    * [BigInteger.negate()](#biginteger_negate)
    * [BigInteger.abs()](#biginteger_abs)
    * [BigInteger.pow()](#biginteger_pow)
    * [BigInteger.modPow()](#biginteger_modpow)
    * [BigInteger.square()](#biginteger_square)
    * [BigInteger.exp10()](#biginteger_exp10)
    * [BigInteger.log()](#biginteger_log)
    * [BigInteger.next()](#biginteger_next)
    * [BigInteger.prev()](#biginteger_prev)
    * [BigInteger.compare()](#biginteger_compare)
    * [BigInteger.compareAbs()](#biginteger_compareabs)
    * [BigInteger.isUnit()](#biginteger_isunit)
    * [BigInteger.isEven()](#biginteger_iseven)
    * [BigInteger.isOdd()](#biginteger_isodd)
    * [BigInteger.sign()](#biginteger_sign)
    * [BigInteger.isPositive()](#biginteger_ispositive)
    * [BigInteger.isNegative()](#biginteger_isnegative)
    * [BigInteger.isZero()](#biginteger_iszero)


---

<a id="biginteger"></a>
## BigInteger Class

An arbitrarily-large integer.

`BigInteger` objects should be considered immutable. None of the "built-in"
methods modify `this` or their arguments. All properties should be
considered private.

All the methods of `BigInteger` instances can be called "statically". The
static versions are convenient if you don't already have a `BigInteger`
object.

As an example, these calls are equivalent.

```js
BigInteger(4).multiply(5); // returns BigInteger(20);
BigInteger.multiply(4, 5); // returns BigInteger(20);

var a = 42;
var a = BigInteger.toJSValue("0b101010");
```


---

<a id="constructor"></a>
### BigInteger(n)

Convert a value to a `BigInteger`.

Although `BigInteger()` is the constructor for `BigInteger` objects, it should
be called as a function. If `n` is a `BigInteger` object, it is simply returned
as-is. Otherwise, `BigInteger()` is equivalent to `BigInteger.parse` without a
radix argument.

```js
var n0 = BigInteger();      // Same as BigInteger.ZERO
var n1 = BigInteger("123"); // Create a new BigInteger with value 123
var n2 = BigInteger(123);   // Create a new BigInteger with value 123
var n3 = BigInteger(n2);    // Return n2, unchanged
```

#### Parameters:

* n - Value to convert to a `BigInteger`.

#### Returns:

A `BigInteger` value.

#### See Also:

* [`BigInteger.parse()`](#parse)


---

<a id="parse"></a>
### BigInteger.parse(s, [base])

Parse a string into a `BigInteger`.

`base` is optional but, if provided, must be from 2 to 36 inclusive. If `base`
is not provided, it will be guessed based on the leading characters of `s` as
follows:

* `"0x"` or `"0X"`: `base` = 16
* `"0c"` or `"0C"`: `base` = 8
* `"0b"` or `"0B"`: `base` = 2
* else: `base` = 10

If no base is provided, or `base` is 10, the number can be in exponential form.
For example, these are all valid:

```js
BigInteger.parse("1e9");              // Same as "1000000000"
BigInteger.parse("1.234*10^3");       // Same as 1234
BigInteger.parse("56789 * 10 ** -2"); // Same as 567
```

If any characters fall outside the range defined by the radix, an exception
will be thrown.

#### Parameters:

* `s` - The string to parse.
* `base` - Optional radix (default is to guess based on `s`).

#### Returns:

a `BigInteger` instance.


---

<a id="zero"></a>
### BigInteger.ZERO

`BigInteger` 0.


---

<a id="one"></a>
### BigInteger.ONE

`BigInteger` 1.


---

<a id="m_one"></a>
### BigInteger.M_ONE

`BigInteger` -1.


---

<a id="biginteger_0"></a>
### BigInteger.\_0

Shortcut for `ZERO`.

---

<a id="biginteger_1"></a>
### BigInteger.\_1

Shortcut for `ONE`.


---

<a id="small"></a>
### BigInteger.small

Array of `BigInteger`s from 0 to 36.

These are used internally for parsing, but useful when you need a "small" `BigInteger`.

#### See Also:

* [BigInteger.ZERO](#zero)
* [BigInteger.ONE](#one)
* [BigInteger._0](#biginteger_0)
* [BigInteger._1](#_1)


---

<a id="max_exp"></a>
### BigInteger.MAX_EXP

The largest exponent allowed in `pow` and `exp10` (`0x7FFFFFFF` or `2147483647`).


---

<a id="tostring"></a>
### toString([base])

Convert a `BigInteger` to a string.

When `base` is greater than 10, letters are upper case.

#### Parameters:

* `base` - Optional base to represent the number in (default is base 10). Must be between 2 and 36 inclusive, or an Error will be thrown.

#### Returns:

The string representation of the `BigInteger`.


---

<a id="tojsvalue"></a>
### toJSValue()

Convert a `BigInteger` to a native JavaScript integer.

#### Returns:

`parseInt(this.toString(), 10)`

#### See Also:

* [toString()](#tostring)
* [valueOf()](#valueof)


---

<a id="add"></a>
### add(n)

Add two `BigInteger`s

#### Parameters:

* n - The number to add to `this`. Will be converted to a `BigInteger`.

#### Returns:

The numbers added together.

#### See Also:

* [subtract()](#subtract)
* [multiply()](#multiply)
* [quotient()](#quotient)
* [next()](#next)


---

<a id="subtract"></a>
### subtract(n)

Subtract two `BigInteger`s.

#### Parameters:

* `n` - The number to subtract from `this`. Will be converted to a `BigInteger`.

#### Returns:

The `n` subtracted from `this`.

#### See Also:

* [add()](#add)
* [multiply()](#subtract)
* [quotient()](#quotient)
* [prev()](#prev)


---

<a id="multiply"></a>
### multiply(n)

Multiply two `BigInteger`s.

#### Parameters:

* `n` - The number to multiply `this` by. Will be converted to a `BigInteger`.

#### Returns:

The numbers multiplied together.

#### See Also:

* [add()](#add)
* [subtract()](#subtract)
* [quotient()](#quotient)
* [square()](#square)


---

<a id="quotient"></a>
### quotient(n)

Divide two `BigInteger`s and truncate towards zero.

`quotient()` throws an exception if `n` is zero.

#### Parameters:

* `n` - The number to divide `this` by. Will be converted to a `BigInteger`.

#### Returns:

`this / n`, truncated to an integer.

#### See Also:

* [add()](#add)
* [subtract()](#subtract)
* [multiply()](#multiply)
* [divRem()](#divrem)
* [remainder()](#remainder)


---

<a id="remainder"></a>
### remainder(n)

Calculate the remainder of two `BigInteger`s.

`remainder` throws an exception if `n` is zero.

#### Parameters:

* `n` - The remainder after `this` is divided `this` by `n`. Will be
    converted to a `BigInteger`.

#### Returns:

`this % n`.

#### See Also:

* [divRem()](#divrem)
* [quotient()](#quotient)


---

<a id="divrem"></a>
### divRem(n)

Calculate the integer quotient and remainder of two `BigInteger`s.

`divRem` throws an exception if `n` is zero.

#### Parameters:

* `n` - The number to divide `this` by. Will be converted to a `BigInteger`.

#### Returns:

A two-element array containing the quotient and the remainder.

```js
a.divRem(b)
```

is exactly equivalent to

```js
[a.quotient(b), a.remainder(b)]
```

except it is faster, because they are calculated at the same time.

#### See Also:

* [quotient()](#quotient)
* [remainder()](#remainder)


---

<a id="divide"></a>
### divide(n)

Deprecated synonym for [quotient()](#quotient).


---

<a id="negate"></a>
### negate()

Get the additive inverse of a `BigInteger`.

#### Returns:

A `BigInteger` with the same magnatude, but with the opposite sign.

#### See Also:

* [abs()](#abs)


---

<a id="abs"></a>
### abs()

Get the absolute value of a `BigInteger`.

#### Returns:

  A `BigInteger` with the same magnitude, but always positive (or zero).

#### See Also:

* [negate()](#negate)


---

<a id="pow"></a>
### pow(n)

Raise a `BigInteger` to a power.

In this implementation, `0**0` is `1`.

#### Parameters:

* `n` - The exponent to raise `this` by. `n` must be no greater than
  `BigInteger.MAX_EXP` (`0x7FFFFFFF`), or an exception will be thrown.

#### Returns:

`this` raised to the `n`th power.

#### See Also:

* [modPow()](#modpow)


---

<a id="modpow"></a>
### modPow(exponent, modulus)

Raise a `BigInteger` to a power (mod `m`).

Because it is reduced by a modulus, `modPow` is not limited by
`BigInteger.MAX_EXP` like `pow`.

#### Parameters:

* `exponent` - The exponent to raise `this` by. Must be positive.
* `modulus` - The modulus.

#### Returns:

`this ** exponent (mod modulus)`.

#### See Also:

* [pow()](#pow)
* [mod()](#mod)


---

<a id="square"></a>
### square()

Multiply a `BigInteger` by itself.

This is slightly faster than regular multiplication, since it removes the
duplicated multiplications.

#### Returns:

```js
this.multiply(this)
```

#### See Also:

* [multiply()](#multiply)


---

<a id="exp10"></a>
### exp10(n)

Multiply a `BigInteger` by a power of 10.

This is equivalent to, but faster than

```js
if (n >= 0) {
  return this.multiply(BigInteger("1e" + n));
} else { // n <= 0
  return this.quotient(BigInteger("1e" + -n));
}
```

#### Parameters:

* `n` - The power of 10 to multiply `this` by. `n` is converted to a
  javascipt number and must be no greater than `BigInteger.MAX_EXP`
  (`0x7FFFFFFF`), or an exception will be thrown.

#### Returns:

`this * (10 ** n)`, truncated to an integer if necessary.

#### See Also:

* [pow()](#pow)
* [multiply()](#multiply)


---

<a id="log"></a>
### log()

Get the natural logarithm of a `BigInteger` as a native JavaScript number.

This is equivalent to

```js
Math.log(this.toJSValue())
```

but handles values outside of the native number range.

#### Returns:

`log(this)`

#### See Also:

* [toJSValue](#tojsvalue)


---

<a id="next"></a>
### next()

Get the next `BigInteger` (add one).

#### Returns:

`this` + 1.

#### See Also:

* [add()](#add)
* [prev()](#prev)


---

<a id="prev"></a>
### prev()

Get the previous `BigInteger` (subtract one).

#### Returns:

`this` - 1.

#### See Also:

* [next()](#next)
* [subtract()](#subtract)


---

<a id="compare"></a>
### compare(n)

Compare two `BigInteger`s.

#### Parameters:

* `n` - The number to compare to `this`. Will be converted to a `BigInteger`.

#### Returns:

  `-1`, `0`, or `+1` if `this` is less than, equal to, or greater than `n`.

#### See Also:

* [compareAbs()](#compareabs)
* [isPositive()](#ispositive)
* [isNegative()](#isnegative)
* [isUnit()](#isunit)


---

<a id="compareabs"></a>
### compareAbs(n)

Compare the absolute value of two `BigInteger`s.

Calling `compareAbs` is faster than calling `abs()` twice, then `compare()`.

#### Parameters:

* `n` - The number to compare to `this`. Will be converted to a `BigInteger`.

#### Returns:

`-1`, `0`, or `+1` if `|this|` is less than, equal to, or greater than `|n|`.

#### See Also:

* [compare()](#compare)
* [abs()](#abs)


---

<a id="isunit"></a>
### isUnit()

Return true iff `this` is either `1` or `-1`.

#### Returns:

`true` if `this` compares equal to `BigInteger.ONE` or `BigInteger.M_ONE`.

#### See Also:

* [isZero()](#iszero)
* [isNegative()](#isnegative)
* [isPositive()](#ispositive)
* [compareAbs()](#compareabs)
* [compare()](#compare)
* [BigInteger.ONE](#one)
* [BigInteger.M_ONE](#m_one)


---

<a id="iseven"></a>
### isEven()

Return true iff `this` is divisible by two.

Note that `BigInteger.ZERO` is even.

#### Returns:

`true` if `this` is even, `false` otherwise.

#### See Also:

* [isOdd()](#isodd)


---

<a id="isodd"></a>
### isOdd()

Return `true` iff `this` is not divisible by two.

#### Returns:

`true` if `this` is odd, `false` otherwise.

#### See Also:

* [isEven()](#iseven)


---

<a id="sign"></a>
### sign()

Get the sign of a `BigInteger`.

#### Returns:

* `-1` if `this < 0`
* `0` if `this == 0`
* `+1` if `this > 0`

#### See Also:

* [isZero()](#iszero)
* [isPositive()](#ispositive)
* [isNegative()](#isnegative)
* [compare()](#compare)
* [BigInteger.ZERO](#zero)


---

<a id="ispositive"></a>
### isPositive()

Return true iff `this > 0`.

#### Returns:

`true` if `this.compare(BigInteger.ZERO) == 1`.

#### See Also:

* [sign()](#sign)
* [isZero()](#iszero)
* [isNegative()](#isnegative)
* [isUnit()](#isunit)
* [compare()](#compare)
* [BigInteger.ZERO()](#zero)


---

<a id="isnegative"></a>
### isNegative()

Return `true` iff `this < 0`.

#### Returns:

`true` if `this.compare(BigInteger.ZERO) == -1`.

#### See Also:

* [sign()](#sign)
* [isPositive()](#ispositive)
* [isZero()](#iszero)
* [isUnit()](#isunit)
* [compare()](#compare)
* [BigInteger.ZERO](#zero)


---

<a id="iszero"></a>
### isZero()

Return `true` iff `this == 0`.

#### Returns:

`true` if `this.compare(BigInteger.ZERO) == 0`.

#### See Also:

* [sign()](#sign)
* [isPositive()](#ispositive)
* [isNegative()](#isnegative)
* [isUnit()](#isunit)
* [BigInteger.ZERO](#zero)


---

<a id="valueof"></a>
### valueOf()

Convert a `BigInteger` to a native JavaScript integer.

This is called automatically by JavaScipt to convert a `BigInteger` to a
native value.

#### Returns:

`parseInt(this.toString(), 10)`

#### See Also:

* [toString()](#tostring)
* [toJSValue()](#tojsvalue)


---

<a id="biginteger_tostring"></a>
### BigInteger.toString(n)

Static equivalent to [`BigInteger(n).toString()`](#tostring).


---

<a id="biginteger_tojsvalue"></a>
### BigInteger.toJSValue(n)

Static equivalent to [`BigInteger(n).toJSValue()`](#tojsvalue).


---

<a id="biginteger_add"></a>
### BigInteger.add(a, b)

Static equivalent to [`BigInteger(a).add(b)`](#add).


---

<a id="biginteger_subtract"></a>
### BigInteger.subtract(a, b)

Static equivalent to [`BigInteger(a).subtract(b)`](#subtract).


---

<a id="biginteger_multiply"></a>
### BigInteger.multiply(a, b)

Static equivalent to [`BigInteger(a).multiply(b)`](#multiply).


---

<a id="biginteger_quotient"></a>
### BigInteger.quotient(a, b)

Static equivalent to [`BigInteger(a).quotient(b)`](#quotient).


---

<a id="biginteger_remainder"></a>
### BigInteger.remainder(a, b)

Static equivalent to [`BigInteger(a).remainder(b)`](#remainder).


---

<a id="biginteger_divrem"></a>
### BigInteger.divRem(a, b)

Static equivalent to [`BigInteger(a).divRem(b)`](#divrem).


---

<a id="biginteger_divide"></a>
### BigInteger.divide(a, b)

Static equivalent to [`BigInteger(a).divide(b)`](#divide).


---

<a id="biginteger_negate"></a>
### BigInteger.negate(n)

Static equivalent to [`BigInteger(n).negate()`](#negate).


---

<a id="biginteger_abs"></a>
### BigInteger.abs(n)

Static equivalent to [`BigInteger(n).abs()`](#abs).


---

<a id="biginteger_pow"></a>
### BigInteger.pow(a, b)

Static equivalent to [`BigInteger(a).pow(b)`](#pow).


---

<a id="biginteger_modpow"></a>
### BigInteger.modPow(base, exponent, modulus)

Static equivalent to [`BigInteger(base).modPow(exponent, modulus)`](#modpow).


---

<a id="biginteger_square"></a>
### BigInteger.square(n)

Static equivalent to [`BigInteger(n).square()`](#square).


---

<a id="biginteger_exp10"></a>
### BigInteger.exp10(b)

Static equivalent to [`BigInteger(a).exp10(b)`](#exp10).


---

<a id="biginteger_log"></a>
### BigInteger.log(n)

Static equivalent to [`BigInteger(n).log()`](#log).


---

<a id="biginteger_next"></a>
### BigInteger.next(n)

Static equivalent to [`BigInteger(n).next()`](#next).


---

<a id="biginteger_prev"></a>
### BigInteger.prev(n)

Static equivalent to [`BigInteger(n).prev()`](#prev).


---

<a id="biginteger_compare"></a>
### BigInteger.compare(a, b)

Static equivalent to [`BigInteger(a).compare(b)`](#compare).


---

<a id="biginteger_compareabs"></a>
### BigInteger.compareAbs(a, b)

Static equivalent to [`BigInteger(a).compareAbs(b)`](#compareabs).


---

<a id="biginteger_isunit"></a>
### BigInteger.isUnit(n)

Static equivalent to [`BigInteger(n).isUnit()`](#isunit).


---

<a id="biginteger_iseven"></a>
### BigInteger.isEven(n)

Static equivalent to [`BigInteger(n).isEven()`](#iseven).


---

<a id="biginteger_isodd"></a>
### BigInteger.isOdd(n)

Static equivalent to [`BigInteger(n).isOdd()`](#isodd).


---

<a id="biginteger_sign"></a>
### BigInteger.sign(n)

Static equivalent to [`BigInteger(n).sign()`](#sign).


---

<a id="biginteger_ispositive"></a>
### BigInteger.isPositive(n)

Static equivalent to [`BigInteger(n).isPositive()`](#ispositive).


---

<a id="biginteger_isnegative"></a>
### BigInteger.isNegative(n)

Static equivalent to [`BigInteger(n).isNegative()`](#isnegative).


---

<a id="biginteger_iszero"></a>
### BigInteger.isZero(n)

Static equivalent to [`BigInteger(n).isZero()`](#iszero).
