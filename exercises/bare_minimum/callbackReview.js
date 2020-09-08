/**
 * Implement these functions following the node style callback pattern
 */

var fs = require('fs');
var request = require('request');
// use node's line reader
var readline = require('readline');
var http = require('http');
var https = require('https');
var nodeUrl = require('url');

// This function should retrieve the first line of the file at `filePath`
var pluckFirstLineFromFile = function (filePath, callback) {

  let readFirstLine = false;

  var lineReader = readline.createInterface({
    input: fs.createReadStream(filePath)
  });

  lineReader.input.on('error', (err) => {
    callback(err);
  });

  lineReader.on('line', (line) => {
    // make sure only first line is returned
    if (!readFirstLine) {
      readFirstLine = true;
      lineReader.close();
      callback(null, line);
    }
  });

  lineReader.on('error', (err) => {
    callback(err);
  });

  lineReader.on('close', (err) => {
    // do nothing
  });
};

// This function should retrieve the status code of a GET request to `url`
var getStatusCode = function (url, callback) {

  let urlObj = null;

  // check if URL is valid
  try {
    urlObj = new URL(url);
  } catch (error) {
    callback(new Error('Invalid URI'));
    return;
  }

  protocol = nodeUrl.parse(url, true).protocol;
  console.log(`Connecting to ${url} with protocol ${protocol}`);

  // determine which node protocol to use
  var nodeProtocol = null;

  if (protocol === 'http:') {
    nodeProtocol = http;
  } else if (protocol === 'https:') {
    nodeProtocol = https;
  } else {
    callback(new Error('Invalid URI'));
    return;
  }

  var req = nodeProtocol.get(url, (res) => {
    res.on('data', (chunk) => {
      // do nothing
    });
    res.on('end', () => {
      console.log(`Status code: ${res.statusCode}`);
      // redirect if necessary
      if (res.statusCode === 301) {
        url = res.headers.location;
        console.log(`Redirecting to ${url}...`);
        getStatusCode(url, callback);
      } else {
        // otherwise invoke callback if request ended
        callback(null, res.statusCode);
      }
    });
  });

  // cleanup
  req.on('error', (err) => {
    callback(new Error('Invalid URI'));
  });

  req.end();

};

// Export these functions so we can test them and reuse them in later exercises
module.exports = {
  getStatusCode: getStatusCode,
  pluckFirstLineFromFile: pluckFirstLineFromFile
};
