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
            getData( URLS.Base + grupo.ID_GRUPO_PONTO() + ".json", function ( result )
            {

                ModelFugitivas.dadosModal(result);
                for (var i in result.MARCACAO_PONTO) {
                    ModelFugitivas.listaPontos.push( ko.mapping.fromJS(result.MARCACAO_PONTO[i]) );
                }

                $( function ()
                    {
                        var $modal = $( '#modalPontos' );
                        $modal.modal( { show: true } ).queue("fx", function ()
                        {

                            $modal.on( 'shown.bs.modal', function ()
                            {
                                $( CONTAINER_IMAGEM ).imgNotes( defaultImgNotes )
                            }
                        );

                        } );
                        
                       
                    }
                );
               
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

