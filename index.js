'use strict';

var spawn = require('child_process').spawn;
var concat = require('concat-stream-promise');

const ENTER = '\x0D';

module.exports = async function(args, combo, options) {
  const defaultOptions = {
    waitBeforeKeystroke: 50,
    waitAfterEnterKeystroke: 100,
    waitBeforeStart: 200,
    waitAfterDone: 200,
  };
  options = Object.assign({}, defaultOptions, options);

  var proc = spawn('node', args, { stdio: [null, null, null] });
  proc.stdin.setEncoding('utf-8');

  const outPromise = proc.stdout.pipe(concat());
  const errPromise = proc.stderr.pipe(concat());

  const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  };

  const len = combo.length;

  timeout(options.waitBeforeStart);

  for (let i = 0; i < len; i++) {
    timeout(options.waitBeforeKeystroke);
    proc.stdin.write(combo[i]);
    if (combo[i] === ENTER) timeout(options.waitAfterEnterKeystroke);
  }

  timeout(options.waitAfterDone);

  const out = (await outPromise).toString();
  const err = (await errPromise).toString();

  proc.stdin.end();

  return {out, err};
};

module.exports.DOWN = '\x1B\x5B\x42';
module.exports.UP = '\x1B\x5B\x41';
module.exports.ENTER = ENTER;
