var express = require('express');
var router = express.Router();

/* Pages routes */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Azmo.org' });
});

router.get('/upload', function(req, res, next){
  res.render('upload', { title: 'Upload Form'});
});

router.get('/rotide', function(req, res, next){
	res.render('rotide', { title: 'Rotide code editor' });
});

router.get('/impulse', function(req, res, next){
	res.render('impulse', { title: 'Impulse Game Engine' });
});

/* Post routes */
// route for uploading files.
router.post('/upload', function(req, res) {
	//console.log(req.files.uploadFile);
	if(!req.files || Object.keys(req.files).length === 0){
		return res.status(400).send('No files were uploaded');
	}

	let uploadFile = req.files.uploadFile;
	uploadFile.mv('/home/azmo/testFile.txt', function(e){
		if(e)
			return res.status(500).send(e);
		res.send("File uploaded successfully!");
	});
});

module.exports = router;