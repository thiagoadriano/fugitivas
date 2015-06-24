/// <reference path="typings/node/node.d.ts"/>

 
var express = require('express');
var server = express();

server.use(express.static(__dirname + '/public') );

server.listen(8080, function(s){
	console.log('Servidor rodando... ');
});
