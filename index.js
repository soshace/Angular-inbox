var express = require('express');
var fs = require('fs');
var app = express();
var envType = process.argv[2];

app.use(express.static(__dirname + (envType === 'debug' ? '/public/' : '/dist/')));

app.get('/', function(req, res) {
    res.redirect('index.html')
});

app.listen(process.env.PORT || 8000, function() {
    console.log('Example app listening on port ' + (process.env.PORT || '8000') + '!');
});
