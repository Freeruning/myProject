var http = require("http");
var url = require("url");
var fs = require('fs');
var mime = require('./mime.js').types;
var path = require("path");

var view = function (response)
{
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write("webService response");
    response.end();
};

//handle 作为一个路径和函数的配对
var handle = {};
handle["/"] = view;

function start(route,handle)
{

    function onRequest(request,response)
    {
        request.setEncoding("utf8");
        //console.log(request.url);

        //解析url路径名
        var pathname =url.parse(request.url).pathname;

        //解析url请求
        var theQuery = url.parse(request.url,true).query;


        var postData ="";

        request.addListener("data",function(postDataChunk)
        {
            postData += postDataChunk;
            //console.log("Received POST data chunk '"+ postDataChunk +"'.");
        });

        request.addListener("end",function(){
            route(handle, pathname,theQuery,response, postData);
        });

    }

    http.createServer(onRequest).listen(8766);
    console.log("Server has started.")
}


function route(handle,pathname,theQuery,response,postData)
{
    console.log(pathname);
    console.log(typeof (handle[pathname]));
    if(typeof (handle[pathname]) == 'function')
    {
        console.log("welcome");
        handle[pathname](response,theQuery,postData);
    }
    else
    {
        console.log("welcome2222");

        var body ='';
        var ext =path.extname(pathname);
        ext = ext ? ext.slice(1) : 'unknown';

        if(fs.existsSync('./'+pathname))
        {
            body = fs.readFileSync('./'+pathname,'binary');
            var contentType = mime[ext] || "text/plain";
            response.writeHead(200, {'Content-Type': contentType});
            response.write(body, "binary");
            response.end();
        }
        else{
            response.writeHead(200, {'Content-Type': "text/plain;charset=utf-8"});
            response.write("没有这个文件");
            response.end();
        }

    }
}





start(route,handle);



