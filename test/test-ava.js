import test from 'ava';
import run, { UP, DOWN, ENTER } from './../index';

const cliPath = __dirname + '/fixtures/cli.js';

test('press enter', async t => {
  const result = await run([cliPath], [ENTER]);
  t.regex(result.out, new RegExp('TEST-1', 'g'));
  t.regex(result.err, new RegExp('ERR-TEST-1', 'g'));
});

test('press down, press enter', async t => {
  const result = await run([cliPath], [DOWN, ENTER]);
  t.regex(result.out, new RegExp('TEST-2', 'g'));
  t.regex(result.err, new RegExp('ERR-TEST-2', 'g'));
});

test('press up, press enter', async t => {
  const result = await run([cliPath], [UP, ENTER]);
  t.regex(result.out, new RegExp('TEST-3', 'g'));
  t.regex(result.err, new RegExp('ERR-TEST-3', 'g'));
});

test('press up, press down, press enter', async t => {
  const result = await run([cliPath], [UP, DOWN, ENTER]);
  t.regex(result.out, new RegExp('TEST-1', 'g'));
  t.regex(result.err, new RegExp('ERR-TEST-1', 'g'));
});
