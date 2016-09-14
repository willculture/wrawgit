var http = require('http');
var https = require('https');
var murl = require('url');
var fs = require('fs');
var cheerio = require('cheerio'); //这个模块是用来讲Html字符串转换为DOM对象， 模仿了jQuery

var token = undefined; //这里确定好一个token

/**
 * 获取最新得git头， 来获取最新得提交代码
 * @param path {String} 请求链接路径
 * @param res {response} 响应对象
 * @param callback {Function} 回调函数
 */
function getToken(path, res, callback) {
	var project_path = path.slice(0, path.indexOf("/master"));
	//首先要获取最新得tag
	https.get({
		hostname : "github.com",
		path : project_path + "/commits/master"
	}, (tagres) => {
		var result = "";
		tagres.on("data", function(chunk) {
			result += chunk;
		});

		tagres.on("end", function() {
			//获取git head;
			var $ = cheerio.load(result);
			var href = $('a.js-permalink-shortcut').attr('href');
			var href_arr = href.split('/');
			token = href_arr[href_arr.length - 1]; 
			callback(path, res);
		});

	});
}

/**
 * 获取到得raw数据， 响应给客户端
 * @param path {String} 请求路径
 * @param res {response} 响应对象
 */
function doRawgit(path, res) {
	console.log(path)
	// 
	https.get({
		hostname : 'raw.githubusercontent.com',
		path : path.replace('master', token)
	}, function(sres) {

		if (path.indexOf(".css") > -1) {
			res.setHeader("Content-Type", "text/css");
		} else if (path.indexOf(".js") > -1) {
			res.setHeader("Content-Type", "application/javascript");
		} else if (path.indexOf(".html") > -1 || path.indexOf(".htm") > -1) {
			res.setHeader("Content-Type", "text/html");
		} 
		
		res.statusCode = 200;
		var content = "";
		sres.on("data", function(data) {
			res.write(data);
		//console.log(data)
		});

		sres.on("end", function() {
			//console.log("end the data")
			res.end(content);
		})
	});

}

/**
 * 创建服务
 */
var server = http.createServer(function(req, res) {
	
	var urlp = murl.parse(req.url);
	var path = urlp.pathname;
	var sc = urlp.search;
      
	if (path.indexOf('master') > -1) {
		getToken(path, res, doRawgit);
	} else if(path == "/" || path == '/index.html'){
		fs.readFile('src/index.html', function(err, data) {
			res.end(data);
		});	
	} else {
		doRawgit(path, res);
	}

});

var port = process.env.PORT || 5000;
server.listen(port);