var http = require('http');
var https = require('https');


var server = http.createServer(function(req, res){
	
	
	
	
	https.get({
		hostname: 'raw.githubusercontent.com',
		//hostname: 'www.ip138.com', 
		path: "/willculture/tCss/master/assets/css/style.css"
		//path: "/"
	}, function (sres) {
		

		res.statusCode = 200;
		var content = "";
	    sres.on("data", function(data) { 
	    	 res.write(data);
	    	 console.log(data)
	    });
	    
	    sres.on("end", function() { 
	    	console.log("end the data")
	    	res.end(content);
	    })
	   
	     
		
	});
	
	
	
	
	 
	
	
});

server.listen(8000);