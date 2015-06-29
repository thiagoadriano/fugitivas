/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var server = express();

server.use(express.static(__dirname + '/public') );

server.listen(5938, function(s){
	console.log('Servidor rodando na porta 5938... ');
});
