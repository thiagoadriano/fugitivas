var getData = function (urlLink, callback) {
    $.ajax({
        url: urlLink,
        type: "GET",
        dataType: "json",
        cache: false,
        sync: true,
        success: function (result) {
            if (callback && typeof callback === "function") {
                callback(result);
            }

        },
        error: function (e) {
            console.error(e);
        }
    });


};
var defaultImgNotes = {
    onAdd: function () {
        this.options.vAll = "bottom";
        this.options.hAll = "middle";
        var elem = $(document.createElement('div')).addClass("marker-point");
        var btn = $(".ui-dialog-buttonset").find("button");
        $.each(btn, function () {
            if ($(this).text() === "Salvar") {
                $(this).addClass("btn btn-success");
            } else if ($(this).text() === "Deletar") {
                $(this).addClass("btn btn-danger");
            } else {
                $(this).addClass("btn btn-default");
            }
        });
        return elem;
    },
    onEdit: function(ev, elem) {
        var $elem = $(elem);
        $('#NoteDialog').remove();
        return $('<div id="NoteDialog"></div>').dialog({
            title: "Adicionar Ponto",
            resizable: false,
            draggable: true,
            modal: true,
            height: "295",
            width: "400",
            position: { my: "left top", at: "right bottom", of: elem},
            buttons: {
                "Salvar": function (event) {
                    $(event.currentTarget).addClass("btn")
                    $(this).dialog("close");
                },
                "Deletar": function() {
                    $elem.trigger("remove");
                    $(this).dialog("close");

                }
            },
            open: function(event, ui) {
                $(this).css("overflow", "hidden");
                
                $(this).load("_form.inc.html");
                
            },
            close: function(event, ui) {
                //$elem.trigger("remove");
                $(this).dialog("close");
            }
        });
    },
    canEdit: true 
};

var ModelFugitivas =
 {
     /*
      * Variáveis de controle
      */
    self:this,
    titleModal : ko.observable(),
    pathIMg : "imagem/",
    listaGrupoPontos: ko.observableArray(),
    editModelFugitivas: ko.observable(),
    dadosModal: ko.observable(),
    listaPontos: ko.observableArray(),

     /*
     * Método que abre o ponto e puxa os dados inserindo no determinado ponto
     */
    openModal: function (grupo)
    {
        if (grupo.ID_GRUPO_PONTO() != "") {
            getData("/json_dados/" + grupo.ID_GRUPO_PONTO() + ".json", function (result) {
                ModelFugitivas.dadosModal(result);
                for (var i in result.MARCACAO_PONTO) {
                    ModelFugitivas.listaPontos.push( ko.mapping.fromJS(result.MARCACAO_PONTO[i]) );
                }

                $(function () {

                    $('#modalPontos')
                        .on('shown.bs.modal', function () {
                            $("#MainContentIMG").imgNotes(defaultImgNotes);
                        })
                        .modal({show:true});

                    
                });
               
            });

            ModelFugitivas.titleModal("Grupo de Ponto: " + grupo.NOME_GRUPO_PONTOS());
           
        }
        
    },

    editClick: function (data)
    {
        this.editModel(data);
    },

    closeModal: function(){
        this.dadosModal([]);
        $(function () {
            $('#modalPontos').modal("hide");
            $(".viewport").html("").remove();
        })
    },


    saveEdit: function (data)
    {

    },

     

     /*
      * Método que chama a listagem dos grupos cadastrados.
     */
    init: function ()
    {
        getData("/json_dados/_lista_de_grupo.json", function(result){
            for (var i in result) {
                ModelFugitivas.listaGrupoPontos.push(ko.mapping.fromJS(result[i]));
            }
        
        });
    }

};

ko.applyBindings(ModelFugitivas);
ModelFugitivas.init();
