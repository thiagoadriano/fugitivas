var CONTAINER_IMAGEM = "#MainContentIMG";
var URLS = {};
URLS.Base = "/json_dados/";
URLS.Especialidade = URLS.Base + "_especialidade.json";
URLS.Componente    = URLS.Base + "_componente.json";
URLS.ListaGrupo    = URLS.Base + "_lista_de_grupo.json";
URLS.Fabricante    = URLS.Base + "_fabricantes.json";
URLS.IncludeForm = "_form.inc.html";


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

var template = "";

var defaultImgNotes = {
    onAdd: function () {
        this.options.vAll = "bottom";
        this.options.hAll = "middle";
        var elem = $(document.createElement('div')).addClass("marker-point");
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
            open: function(event, ui) {
                $(this).css("overflow", "hidden");
                template.appendTo($(this));

                $('#myTab a').click(function (e) {
                    e.preventDefault()
                    $(this).tab('show')
                });
                (function () {
                    ModelFugitivas.tipoSelecionado.subscribe(
                        function (data) {
                            ModelFugitivas.listagemSubtipo([]);
                            var objetoComponente = ModelFugitivas.listagemComponente()[data];

                            console.log(data)

                            if (objetoComponente !== undefined && objetoComponente.SUBTIPO().length) {
                                for (var i in objetoComponente.SUBTIPO()) {
                                    ModelFugitivas.listagemSubtipo.push(objetoComponente.SUBTIPO()[i]);
                                };
                            }
                            else {
                                ModelFugitivas.listagemSubtipo.push({ NOME: "Selecione um Tipo com Subtipo", ID: "" });
                            }

                        }
                    );
                })()
               
            },
            close: function(event, ui) {
                $elem.trigger("remove");
                $(this).dialog("close");
            }
        });
    }
};

var ModelFugitivas =
 {

    self: this,
    titleModal : ko.observable(),
    listaGrupoPontos: ko.observableArray(),
    editModelFugitivas: ko.observable(),
    pathIMg: "imagem/",
    dadosModal: ko.observable(),
    listaPontos: ko.observableArray(),
    btnEditar: ko.observable("Editar"),
    listagemComponente: ko.observableArray(),
    listagemEspecialidade: ko.observableArray(),
    listagemFabricante: ko.observableArray(),
    listagemSubtipo: ko.observableArray([{ NOME: "Selecione um Tipo com Subtipo", ID: "" }]),
    tipoSelecionado: ko.observable(),
    subtipoSelecionado: ko.observable(),

    openModal: function (grupo)
    {
        if (grupo.ID_GRUPO_PONTO() != "") {
            getData(URLS.Base + grupo.ID_GRUPO_PONTO() + ".json", function (result) {
                ModelFugitivas.dadosModal(result);
                for (var i in result.MARCACAO_PONTO) {
                    ModelFugitivas.listaPontos.push( ko.mapping.fromJS(result.MARCACAO_PONTO[i]) );
                }

                $(function () {
                    $('#modalPontos')
                        .on('shown.bs.modal', function () {
                            $(CONTAINER_IMAGEM).imgNotes(defaultImgNotes);
                        })
                        .modal({ show: true });
                });
               
            });

            ModelFugitivas.titleModal(grupo.NOME_GRUPO_PONTOS());
           
        }
        
    },

    editClick: function ()
    {
        if ($(CONTAINER_IMAGEM).imgNotes("option", "canEdit")) {
            $(CONTAINER_IMAGEM).imgNotes("option", "canEdit", false)
            ModelFugitivas.btnEditar("Editar");
        } else {
            $(CONTAINER_IMAGEM).imgNotes("option", "canEdit", true);
            ModelFugitivas.btnEditar("Concluir");
        }
    },

    closeModal: function(){
        this.dadosModal([]);
        $('#modalPontos').modal("hide");
        $(".viewport").html("").remove();
        
    },

    init: function ()
    {

       /* getData(URLS.ListaGrupo, function(result){
            for (var i in result) {
                ModelFugitivas.listaGrupoPontos.push(ko.mapping.fromJS(result[i]));
            }
        
        });
        getData(URLS.Componente, function (resultComponente) {
            for (var i in resultComponente) {
                if (resultComponente[i].STATUS === "ativo") {
                    ModelFugitivas.listagemComponente.push(ko.mapping.fromJS(resultComponente[i]));
                }
                
            }
        });
        getData(URLS.Fabricante, function (resultFabricante) {
            for (var i in resultFabricante) {
                if (resultFabricante[i].STATUS === "ativo") {
                    ModelFugitivas.listagemFabricante.push(ko.mapping.fromJS(resultFabricante[i]));
                }
                
            }
        });
        getData(URLS.Especialidade, function (resultEspecialidade) {
            for (var i in resultEspecialidade) {
                if (resultEspecialidade[i].STATUS === "ativo") {
                    ModelFugitivas.listagemEspecialidade.push(ko.mapping.fromJS(resultEspecialidade[i]));
                }

            }
            
        });*/


        $.when($.ajax(URLS.ListaGrupo), $.ajax(URLS.Componente), $.ajax(URLS.Fabricante), $.ajax(URLS.Especialidade)).done(
            function (result, resultComponente, resultFabricante, resultEspecialidade) {
                for (var i in result) {
                    ModelFugitivas.listaGrupoPontos.push(ko.mapping.fromJS(result[i]));
                };
                for (var i in resultComponente) {
                    if (resultComponente[i].STATUS === "ativo") {
                        ModelFugitivas.listagemComponente.push(ko.mapping.fromJS(resultComponente[i]));
                    }

                };
                for (var i in resultFabricante) {
                    if (resultFabricante[i].STATUS === "ativo") {
                        ModelFugitivas.listagemFabricante.push(ko.mapping.fromJS(resultFabricante[i]));
                    }

                };
                for (var i in resultEspecialidade) {
                    if (resultEspecialidade[i].STATUS === "ativo") {
                        ModelFugitivas.listagemEspecialidade.push(ko.mapping.fromJS(resultEspecialidade[i]));
                    }

                }
            }// end when
       )
        
    }

};


ko.applyBindings(ModelFugitivas);
ModelFugitivas.init();


$(function () {
    template = $("#fromDados").detach();
});