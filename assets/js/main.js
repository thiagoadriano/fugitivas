/// <reference path="../../typings/jquery/jquery.d.ts"/>
var Fugitivas = Fugitivas || {};

$(function(){
  Fugitivas.MAIN_IMAGE = $("#MainContentIMG");
  
  
  
  var options = {
   canEdit: true
  };
  
  
  
  Fugitivas.MAIN_IMAGE.imgNotes(options);
  
  Fugitivas.MAIN_IMAGE.imgNotes("addNote", 0.4,0.3,"Note <b>Text</b>");
});
