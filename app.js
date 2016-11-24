var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visual_recognition = new VisualRecognitionV3({
    api_key: 'e9b2d83b02a794c8c61219fd956725815d55110a',
    version_date: '2016-05-19'
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function (req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    var fileName;
    var exccedSize;
    form.on('file', function (field, file) {
        if (file.size > 2097152) { //Max Size
            exccedSize = true;
            fs.unlinkSync(file.path);
        } else {
            exccedSize = false;
            fs.renameSync(file.path, path.join(form.uploadDir, file.name));
            fileName = file.name;
        }
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        if (exccedSize == true) {
            res.end("error:Ha exedido en Tamaño permitido para el archivo");
        } else {
            var params = {
                images_file: fs.createReadStream(path.join(form.uploadDir, fileName))
            };
            visual_recognition.classify(params, function (err, response) {
                if (err) {
                    console.log(err);
                    res.end("error:Classify Error");
                } else {
                    res.end(JSON.stringify(response, null, 2));
                }
            });
        }
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

var server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});