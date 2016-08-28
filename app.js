var http = require('http');
var https = require('https');
var murl = require('url');


var server = http.createServer(function(req, res){
	
	var urlp = murl.parse(req.url);
	var path = urlp.pathname;
	var sc = urlp.search;
	//console.log(req.url)
	
	
	https.get({
		hostname: 'raw.githubusercontent.com',
		//hostname: 'www.ip138.com', 
		path: path
		//path: "/"
	}, function (sres) {
		

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
	
	
	
	
	 
	
	
});
var port = process.env.PORT || 5000;
server.listen(port);