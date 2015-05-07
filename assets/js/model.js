/// <reference path="../../typings/knockout/knockout.d.ts"/>
var ModelFugitivas = function(){
	var self = this;
	var edit = false;
	
	this.troggleEdit = function(){
		if(self.edit)
		 {
			 alert(self.edit);
			self.edit = false;
		 }
		else
		 {
			 alert(self.edit);
			self.edit = true;	
		 }
	};
};

ko.applyBindings(new ModelFugitivas());
