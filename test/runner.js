const cp = require('child_process' );
// --require babel-register --require test/setup.js
cp.spawnSync('mocha', [ `src/**/${process.env.RUNNER || '*.test.js'}`, '--ui', 'qunit', '--compilers', 'js:babel-register', '--require', 'babel-register', '--require', 'test/setup.js' ], {
    cwd: process.cwd(),
    stdio: 'inherit',
} );
