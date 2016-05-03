// File created by Jack Morris on 05/02/16
//

// Small node.js app that takes POSTs and GETs to simulate
// a very minimal blog

var express           = require('express'),
    fs                = require('fs'),
    bodyParser        = require('body-parser')
    app               = express();

app.use(bodyParser.json());   // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));                          // to support URL-encoded bodies

// what does this do
// app.use(methodOverride());      // simulate DELETE and PUT

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var dbFile = 'updates';

/* Basic Routes */

// GET method route
app.get('/', function (req, res) {
  // grab contents of file
  var data = readFile(dbFile, function(data) {
    // return contents
    res.writeHead(200, {'Content-Type': '.txt'});
    res.write(data);
    res.end();
  });
});

// POST method route
app.post('/', function (req, res) {
  console.log('req:\n',req);
  console.log('got post with req.body:\n',req.body);
  // make obj
  var t = ( new Date() ).getTime(); //epoch ms or whatever
  var obj = {
    date: t,
    text: req.body.text
  };
  // change obj to string
  var objAsString = JSON.stringify(obj);
  // append to paths.txt
  writeToEndOfFile(dbFile,objAsString);
  res.sendStatus(200); // equivalent to res.status(200).send('OK')
});

/* 
  helper functions
*/
function readFile(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) { 
      throw err;
    }
    callback(data);
  });
}

function writeToEndOfFile(filename, data) {
  data = data + '\n';
  /* TIL: fs.writeFile overwrites file */
  console.log('writing data:',data,'to file:',filename);
  fs.appendFile(filename, data, function (err) {
    if (err) { 
      return console.log(err);
    }
  });
}
