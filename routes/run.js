var express = require('express');
var router = express.Router();
var uuid = require('uuid-v4');

var spawn = require('child_process').spawn;

var fs = require('fs');
var https = require('https');
var app = express();

var options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt'),
  ca: fs.readFileSync('./csr.pem')
};
var serverPort = 4000;

var server = https.createServer(options, app);
var io = require('socket.io')(server);

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});

app.use(express.static('public'));
app.get('/', function (req, res) {

  if (req.query && req.query.id)
    res.send(fs.readFileSync('./public/out/'+req.query.id+'.out'));

  res.header('Content-type', 'text/html');
  return res.end('<h1>Hello, Secure World!</h1>');
});

var lang = {
  JavaScript: {
    name: 'JavaScript',
    cmds: [
      {
        cmd: function (params) {
          return 'nodejs';
        },
        arg: function (params) {
          return [params.filename, '> public/out/' + params.id + '.out'];
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
    var UUID = data.id;
    data.language = lang[data.language];
    data.filename = 'scripts/' + UUID + data.language.suffix;
    //fs.mkdirSync('scripts');
    fs.writeFile(data.filename, data.input, function (err) {
      if (err) throw err;
      console.log('The data was appended to file!');

      var commands = data.language.cmds;
      for (var i in commands) {
        var cmd = commands[i].cmd(data);
        var arg = commands[i].arg(data);
        console.log(cmd + " " + arg);

        var child = spawn(cmd, arg);
        child.stdout.on('data', function (chunk) {
          socket.emit(UUID, {type: "msg", body: chunk.toString('utf8')});
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

app.post('/run', function(req, res){
  if (req.body && req.body.id && req.body.language && req.body.input) {
    var data = req.body;

    var UUID = data.id;
    data.language = lang[data.language];
    data.filename = 'scripts/' + UUID + data.language.suffix;
    data.outfile = 'public/out/' + data.id + '.out';
    //fs.mkdirSync('scripts');
    fs.writeFile(data.filename, data.input, function (err) {
      if (err) throw err;
      console.log('The data was appended to file!');

      var commands = data.language.cmds;
      for (var i in commands) {
        var cmd = commands[i].cmd(data);
        var arg = commands[i].arg(data);
        console.log(cmd + " " + arg);

        var child = spawn(cmd, arg);
        child.stdout.on('data', function (chunk) {
          fs.appendFile(data.outfile, chunk.toString('utf8'), function (err) {
          });
          //socket.emit(UUID, {type: "msg", body: chunk.toString('utf8')});
        });
      }
    });
  }
  res.redirect("/testing.html");
});

module.exports = router;
