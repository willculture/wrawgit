/**
 * http://usejsdoc.org/
 */


var href = "http://www.bianchengderen.com/hello/in?name=will&pass=duanhua#index";

var murl = require('url');

var purl = murl.parse(href);
console.log(purl)

var query = purl.query;
var query_arr = query.split('&');

query_arr.forEach((item)=>{
	var keyval = item.split("=");
	console.log(keyval[0], keyval[1]);
})

console.log(query_arr)