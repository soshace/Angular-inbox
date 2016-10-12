var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res) {
    fs.createReadStream('./public/index.html').pipe(res);
});

app.listen(process.env.PORT || 8000, function() {
    console.log('Example app listening on port ' + (process.env.PORT || '8000') + '!');
});
