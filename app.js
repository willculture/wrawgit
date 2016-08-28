var http = require('http');
var https = require('https');
var murl = require('url');
var cheerio = require('cheerio');



var token = undefined;
var doto = false;
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
			doto = true;
			console.log(doto);
			callback(path, res);
		});

	});
}

function doRawgit(path, res) {
	// 
	https.get({
		hostname : 'raw.githubusercontent.com',
		path : path.replace('master', token)
	}, function(sres) {


		res.statusCode = 200;
		var content = "";
		sres.on("data", function(data) {
			res.write(data);
		//console.log(data)
		});

		sres.on("end", function() {
			console.log("end the data")
			res.end(content);
		})
	});

}

var server = http.createServer(function(req, res) {

	var urlp = murl.parse(req.url);
	var path = urlp.pathname;
	var sc = urlp.search;
	console.log(token)

	if (!token) {
		getToken(path, res, doRawgit);
	} else {
		doRawgit(path, res);
	}
	

	


});
var port = process.env.PORT || 5000;
server.listen(port);