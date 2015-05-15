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

var defaultImgNotes = {
    onAdd: function () {
        this.options.vAll = "bottom";
        this.options.hAll = "middle";
        var elem = $(document.createElement('div')).addClass("marker-point");
        return elem;
    },
    onEdit: function(ev, elem) {
        var $elem = $(elem);
        $(CONTAINER_IMAGEM).imgNotes()
        $elem.attr("data-bind", "")
        $('#NoteDialog').remove();
        ModelFugitivas.flagNovoPonto(true);
        return $('<div id="NoteDialog"></div>').dialog({
            title: (ModelFugitivas.flagNovoPonto() === true) ? "Adicionar Ponto" : "Editar Ponto",
            resizable: false,
            draggable: true,
            modal: true,
            closeOnEscape: false,
            closeText: "hide",
            height: "280",
            width: "400",
            position: { my: "left top", at: "right bottom", of: elem },
            open: function(event, ui) {
                $(this).css("overflow", "hidden");
                $('.ui-dialog-titlebar-close').remove();
                $(this).attr("data-bind", "component: {name: 'form-content', params:{tipos: listagemComponente, fabricantes: listagemFabricante, especialidade: listagemEspecialidade, flag: flagNovoPonto}}");
                ko.applyBindings(ModelFugitivas, $("#NoteDialog")[0]);
            }
        });
    },

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
    flagNovoPonto : ko.observable(),

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
                            $(CONTAINER_IMAGEM).imgNotes(defaultImgNotes)
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
        if (ModelFugitivas.btnEditar() !== "Editar") {
            $(CONTAINER_IMAGEM).imgNotes("option", "canEdit", false);
            ModelFugitivas.btnEditar("Editar");
        }

        $('#modalPontos').modal("hide");
        $(".viewport").html("").remove();
        
    },

    init: function ()
    {

        getData(URLS.ListaGrupo, function(result){
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
            
        });
        
    }
};

ko.applyBindings(ModelFugitivas);
ModelFugitivas.init();

