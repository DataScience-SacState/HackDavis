var express = require('express');
var router = express.Router();
var uuid = require('uuid-v4');

var spawn = require('child_process').spawn;

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

server.listen(47747);

var lang = {
  JavaScript: {
    name: 'JavaScript',
    cmds: [
      {
        cmd: function (params) {
          return 'node';
        },
        arg: function (params) {
          return [params.filename];
        }
      }
    ],
    suffix: '.js'
  },
  Python2: {
    name: 'Python2',
    cmds: [
      {
        cmd: function (params) {
          return 'python2';
        },
        arg: function (params) {
          return [params.filename];
        }
      }
    ],
    suffix: '.py'
  },
  Python3: {
    name: 'Python3',
    cmds: [
      {
        cmd: function (params) {
          return 'python3';
        },
        arg: function (params) {
          return [params.filename];
        }
      }
    ],
    suffix: '.py'
  },
  R: {
    name: 'R',
    cmds: [
      {
        cmd: function (params) {
          return 'Rscript';
        },
        arg: function (params) {
          return [params.filename];
        }
      }
    ],
    suffix: '.r'
  },
  Java: {
    name: 'Java',
    cmds: [
      {
        cmd: function (params) {
          return 'javac';
        },
        arg: function (params) {
          return [params.filename];
        }
      },
      {
        cmd: function (params) {
          return 'java';
        },
        arg: function (params) {
          return [params.filename.substring(0, params.filename.length - 5)];
        }
      }
    ],
    suffix: '.java'
  }
};

io.on('connection', function (socket) {
  socket.emit('update', 'test!');
  socket.on('compile', function (data) {
    var UUID = uuid();
    data.language = lang[data.language];
    data.filename = 'scripts/' + UUID + data.language.suffix;
    //fs.mkdirSync('scripts');
    fs.appendFile(data.filename, data.input, function (err) {
      if (err) throw err;
      console.log('The data was appended to file!');

      var commands = data.language.cmds;
      for (var i in commands) {
        var cmd = commands[i].cmd(data);
        var arg = commands[i].arg(data);
        console.log(cmd + " " + arg);

        var child = spawn(cmd, arg);
        child.stdout.on('data', function (chunk) {
          socket.emit('update', chunk.toString('utf8'));
        });
      }
    });

  });
});

var procs = {};

// or if you want to send output elsewhere
//child.stdout.pipe(dest);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("k");
});

router.post('/', function(req, res){
  if (req.body.user && req.body.language && req.body.input) {
    console.log(req.body.language);
    console.log(req.body.input);
    res.end('yes!');
  }
});

module.exports = router;
