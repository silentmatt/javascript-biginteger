# javascript-biginteger

[![Gitter](https://badges.gitter.im/silentmatt/javascript-biginteger.svg)](https://gitter.im/silentmatt/javascript-biginteger?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Usage

### In Node.js

    const BigInteger = require('./path/to/biginteger').BigInteger;
    var a = BigInteger('123456789');
    var b = BigInteger('10000000000');
    var c = BigInteger('987654321');

    console.log(a.multiply(b).add(c).toString()); // '1234567890987654321'

### In a web browser

    <script src="path/to/biginteger.js"></script>
    <script>
        var a = BigInteger('123456789');
        var b = BigInteger('10000000000');
        var c = BigInteger('987654321');

        console.log(a.multiply(b).add(c).toString()); // '1234567890987654321'
    </script>

For more details, see the full [API documentation](https://silentmatt.com/biginteger-docs/files/biginteger-js.html).
