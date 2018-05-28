#!/usr/bin/env node
const execSync = require("child_process").execSync;

const exec = (cmd, env) =>
  execSync(cmd, {
    stdio: "inherit",
    env: Object.assign({}, process.env, env)
  });
const cwd = process.cwd();
const packages = ["redva","redva-core","redva-loading"];
for( const key in packages ){
  const package = packages[key];
  exec("cd "+cwd+"/packages/"+package+" && npm test")
}

