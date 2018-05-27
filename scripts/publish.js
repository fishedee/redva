#!/usr/bin/env node
const shell = require('shelljs');
const { join } = require('path');
const {fork} = require('child_process');
const packages = ["redva","redva-core","redva-loading"];
const cwd = process.cwd();

if (
  shell
    .exec('npm config get registry')
    .stdout.indexOf('https://registry.npmjs.org/') === -1
) {
  console.error(
    'Failed: set npm registry to https://registry.npmjs.org/ first'
  );
  process.exit(1);
}

shell.exec("npm run build");

const cp = fork(
  join(cwd, 'node_modules/.bin/lerna'),
  ['publish', '--skip-npm'].concat(process.argv.slice(2)),
  {
    stdio: 'inherit',
    cwd: cwd,
  }
);
cp.on('error', err => {
  console.log(err);
});
cp.on('close', code => {
  console.log('code', code);
  if (code === 1) {
    console.error('Failed: lerna publish');
    process.exit(1);
  }

  publishToNpm();
});

function publishToNpm() {
  for( const key in packages){
    const package = packages[key];
    shell.cd(join(cwd, 'packages', package));
    shell.exec(`npm publish`);
  };
}
