
var ModelFugitivas = {
    listModel: ko.observableArray(),
    editModel: ko.observable(),
    dadosModal: ko.observableArray(),

    openModal: function (data)
    {
        
    },

    editClick: function (data)
    {
        this.editModel(data);
    },

    saveEdit: function (data)
    {

    },

    getData: function (urlLink, model)
    {
        $.ajax({
            url: urlLink,
            type: "GET",
            dataType: "json",
            cache: false,
            sync: true,
            success: function (result) {
                for (var i in result) {
                    model.push(ko.mapping.fromJS(result[i]));
                }
                
            },
            error: function (e) {
                console.error(e);
            }
        });


    },

    init: function ()
    {
        this.getData("/json_dados/_lista_de_grupo.json", this.listModel);
    }

};

ko.applyBindings(ModelFugitivas);
ModelFugitivas.init();
