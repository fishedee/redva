const shell = require('shelljs');
const packages = ["redva","redva-core","redva-loading"];
for( const key in packages ){
  const package = packages[key];
  shell.exec("babel packages/"+package+"/src -d packages/"+package+"/lib")
}

