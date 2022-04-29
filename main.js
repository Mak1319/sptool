#!/usr/bin/node
const fs = require('fs/promises');
const fs2 = require('fs')
const path = require('path');
const extractZip = require('extract-zip')
const ApkReader = require('node-apk-parser')
const {promisify} = require('util');
const rename= promisify(fs2.rename);


const startInit = async (ind) => {

	const arg = ind
	if (!arg) return;
	const abspath = path.resolve(arg);
	
	
	const reader = ApkReader.readFile(abspath)
	const manifest = await reader.readManifestSync()

	const spckDir = '/storage/emulated/0/Android/data/io.spck/'
	const outDir = path.resolve(spckDir, `spck$v${manifest.versionName}-output`);

	// console.log(fs);
	if (fs2.existsSync(outDir)) await fs.rm(outDir, { recursive: true })
	await extractZip(abspath,{dir:path.resolve(outDir)})
	
	
	const finalOutDirPath=path.join(spckDir,`spck$v${manifest.versionName}`)
	const assetsDir=path.join(outDir,'assets');
	
	if (fs2.existsSync(finalOutDirPath)) await fs.rm(finalOutDirPath, { recursive: true })
	await rename(assetsDir,finalOutDirPath)
	
	
	await fs.rm(outDir,{ recursive: true });

}


const arg=process.argv.slice(2);

console.log(arg);

switch(arg[0]){
	case 'create':
		startInit(arg[1]);
		break;
}
