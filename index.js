'use strict';

var spawn = require('child_process').spawn;
var concat = require('concat-stream-promise');

const ENTER = '\x0D';

module.exports = async function(args, combo, options) {
  const defaultOptions = {
    waitBeforeKeystroke: 50,
    waitBeforeStart: 200,
    waitAfterDone: 200,
  };
  options = Object.assign({}, defaultOptions, options);

  var proc = spawn('node', args, { stdio: [null, null, null] });
  proc.stdin.setEncoding('utf-8');

  const len = combo.length;

  const loop = (combo, i) => {
    let wait = options.waitBeforeKeystroke;
    if (i === 0) wait = options.waitBeforeStart;
    if (i === len) wait = options.waitAfterDone;
    setTimeout(() => {
      if (combo.length > 0) {
        proc.stdin.write(combo[0]);
        loop(combo.slice(1), i + 1);
      } else {
        proc.stdin.end();
      }
    }, wait);
  };

  loop(combo);

  const out = (await proc.stdout.pipe(concat())).toString();
  const err = (await proc.stderr.pipe(concat())).toString();
  return {out, err};
};

module.exports.DOWN = '\x1B\x5B\x42';
module.exports.UP = '\x1B\x5B\x41';
module.exports.ENTER = ENTER;
