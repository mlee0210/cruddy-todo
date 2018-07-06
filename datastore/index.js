const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var filepath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filepath, text, (err) => {
      if(err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text} );
      }
    });
  });
};

exports.readAll = (callback) => {

 fs.readdir(exports.dataDir, (err, files) => {
   var data = _.map(files, (file) => {
     var id = path.basename(file, '.txt');
     var filepath = path.join(exports.dataDir, file);
     return readFilePromise(filepath).then((data) => {
       return {id: id, text: data.toString()}
     });
   });
  Promise.all(data).then((results) => callback(null, results));
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: data.toString()});
    }
  });
};


exports.update = (id, text, callback) => {

  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, (err, data) => {
    if(err) {
      callback(err);
    } else {
      fs.writeFile(filepath, text, (err) => {
        if(err) {
          callback(err);
        } else {
        callback(null, {id: id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {

  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filepath, (err) => {
    if(err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
