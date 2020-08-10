let express = require('express');
let router = express.Router();
const fs = require('fs');
const os = require('os');

const rootFolderPath = process.cwd(); //os.type() === 'Linux' ? '/home/azmo/projects/webZoneX' : 'E:\\chielFiles\\webZone';
const slash = os.type() === 'Linux' ? '/' : '\\';

router.post('/folder', function(req, res, next) {
	const oldFolderPath = (typeof(req.body["folderpath[]"]) === "string" ? new Array( req.body["folderpath[]"] ) : req.body["folderpath[]"]);
	let folderPath = Array.from(oldFolderPath);

	// the first entry of the folderpath array is always root, get rid of it
	folderPath.shift();
	let folderToGet = rootFolderPath;
	console.log("oldFolderPath", oldFolderPath);

	folderToGet = folderPath.reduce( (acum, cur) => {
		return acum+slash+cur;
	}, folderToGet);

	console.log("Folder to get: ", folderToGet);
	
	let retval = {
		nodePath: oldFolderPath,
		folderContents: []
	};

	fs.readdir(folderToGet, {withFileTypes: true}, (err, files) => {
		console.log("Wheres the files lebowsky?! ", files);
		// if files === undefined then the folder didn't exist
		for(i in files){
			console.log("parsing file... "+files[i].name);
			retval.folderContents.push({name: ""+files[i].name, isFolder: ""+files[i].isDirectory()});
		}
		console.log("sending the following data..");
		console.log(retval);
		res.send(retval);
	});
});

router.post('/file', function(req, res, next) {
	let fileToOpen = req.body.filePath;
	let fileContents = fs.readFileSync('/home/azmo/webZone/'+fileToOpen);
	res.send(fileContents);
});

module.exports = router;
