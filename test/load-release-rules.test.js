import test from 'ava';
import loadReleaseRules from '../lib/load-release-rules';
import testReleaseRules from './fixtures/release-rules';

const cwd = process.cwd();

test('Accept a "releaseRules" option', t => {
  const releaseRules = loadReleaseRules({releaseRules: testReleaseRules}, {cwd});

  t.deepEqual(releaseRules, testReleaseRules);
});

test('Accept a "releaseRules" option that reference a requierable module', t => {
  const releaseRules = loadReleaseRules({releaseRules: './test/fixtures/release-rules'}, {cwd});

  t.deepEqual(releaseRules, testReleaseRules);
});

test('Return undefined if "releaseRules" not set', t => {
  const releaseRules = loadReleaseRules({}, {cwd});

  t.is(releaseRules, undefined);
});

test('Preserve release rules set to "false" or "null"', t => {
  const releaseRules = loadReleaseRules(
    {
      releaseRules: [
        {type: 'feat', release: false},
        {type: 'fix', release: null},
      ],
    },
    {cwd}
  );

  t.deepEqual(releaseRules, [
    {type: 'feat', release: false},
    {type: 'fix', release: null},
  ]);
});

test('Throw error if "releaseRules" reference invalid commit type', t => {
  t.throws(
    () => loadReleaseRules({releaseRules: [{tag: 'Update', release: 'invalid'}]}, {cwd}),
    /Error in commit-analyzer configuration: "invalid" is not a valid release type\. Valid values are:\[?.*\]/
  );
});

test('Throw error if a rule in "releaseRules" does not have a release type', t => {
  t.throws(
    () => loadReleaseRules({releaseRules: [{tag: 'Update'}]}, {cwd}),
    /Error in commit-analyzer configuration: rules must be an object with a "release" property/
  );
});

test('Throw error if "releaseRules" is not an Array or a String', t => {
  t.throws(
    () => loadReleaseRules({releaseRules: {}}, {cwd}),
    /Error in commit-analyzer configuration: "releaseRules" must be an array of rules/
  );
});

test('Throw error if "releaseRules" option reference a requierable module that is not an Array or a String', t => {
  t.throws(
    () => loadReleaseRules({releaseRules: './test/fixtures/release-rules-invalid'}, {cwd}),
    /Error in commit-analyzer configuration: "releaseRules" must be an array of rules/
  );
});

test('Throw error if "releaseRules" contains an undefined rule', t => {
  t.throws(
    () => loadReleaseRules({releaseRules: [{type: 'feat', release: 'minor'}, undefined]}, {cwd}),
    /Error in commit-analyzer configuration: rules must be an object with a "release" property/
  );
});
