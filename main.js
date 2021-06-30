var http = require('http');
var fs = require('fs');
var url = require('url');
function templateHTML(title, list, body) {
    return `
    <!DOCTYPE html>
    <html>
      <head> 
        <title>Young Planner - ${title}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="colors.js"></script>
      </head>
      <body>
        <input type="button" value="Night" onclick="
          nightdayhandler(this);  
        ">
        <h1><a href="/">Young Planner</a></h1>
        <div id="grid">
          ${list}
          <div id="article">
            <a href="/create"><input type="button" value="Create"></a>
            ${body}
          </div>
        </div>
      </body>
    </html>
  `
};
function templateList(filelist) {
    var list = '<ol>';
    var i = 0;
    while(i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i = i+1
    };
    list = list+'</ol>';
    return list;
};
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist) {
          var title = "Welcome";
          var description = 'GTD를 응용한 일정관리 프로그램' ;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>
          <p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
              var title = queryData.id;
              var list = templateList(filelist);
              var template = templateHTML(title, list, `<h2>${title}</h2>
              <p>${description}</p>`);
              response.writeHead(200);
              response.end(template);
            });
          });
      };
    } else if(pathname === '/create') {
        fs.readdir('./data', function(error, filelist) {
          var title = "Youngs Planner - Create";
          var list = templateList(filelist);
          var template = templateHTML(title, list, `
          <form action="http://localhost:3000/process_create" method = "post">
          <p><input type="text" name="title" placeholder="Title"></p>
          <p>
            <textarea name="description" placeholder="Description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
          `);
          response.writeHead(200);
          response.end(template);
        });
    } else {
          response.writeHead(404);
          response.end('Not found');
    };
  });      
app.listen(3000);