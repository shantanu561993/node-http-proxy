var https     = require('https'),
    http      = require('http'),
    httpProxy = require('./lib/http-proxy'),
    proxy = httpProxy.createProxyServer({});


var server = http.createServer(function(req, res) {
  var target = 'https://www.heroku.com';
  var host = 'www.heroku.com';
  var header = req.headers['authorization'];
  var ver=false;
  if(header) {
    var token=header.split(/\s+/).pop()||'',
        auth=new Buffer(token, 'base64').toString(),
        parts=auth.split(/:/),
        user=parts[0],
        pass=parts[1];
        if (process.env.USER === user  && process.env.PASS === pass) {
          ver=true;
          target = process.env.TARGET;
          host = process.env.HOST;
        }
  }
  console.log(ver, target, host)
  proxy.web(req, res, {
    target: target,
    agent  : https.globalAgent,
    xfwd: false,
    headers: {
      host: host
    }
  });
});

server.listen(process.env.PORT || 8888);