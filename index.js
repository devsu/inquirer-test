'use strict';

var spawn = require('child_process').spawn;
var concat = require('concat-stream-promise');

const ENTER = '\x0D';

module.exports = async function(args, combo, options) {
  const defaultOptions = {
    timeout: 5,
    initialTimeout: 200,
    enterTimeout: 10,
  };
  options = Object.assign({}, defaultOptions, options);
  let nextTimeout = options.initialTimeout;

  var proc = spawn('node', args, { stdio: [null, null, null] });
  proc.stdin.setEncoding('utf-8');

  var loop = function(combo) {
    if (combo.length > 0) {
      setTimeout(function() {
        proc.stdin.write(combo[0]);
        nextTimeout = combo[0] === ENTER ? options.enterTimeout : options.timeout;
        loop(combo.slice(1));
      }, nextTimeout);
    } else {
      proc.stdin.end();
    }
  };

  loop(combo);

  const out = (await proc.stdout.pipe(concat())).toString();
  const err = (await proc.stderr.pipe(concat())).toString();
  return {out, err};
};

module.exports.DOWN = '\x1B\x5B\x42';
module.exports.UP = '\x1B\x5B\x41';
module.exports.ENTER = ENTER;
