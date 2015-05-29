var Fugitivas = Fugitivas || {};

Fugitivas.ModelFugitivas =
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
    flagSatatusPonto: ko.observable(),
    idPonto: ko.observable(),

    openModal: function (grupo)
    {
        if (grupo.ID_GRUPO_PONTO() != "") {
            Fugitivas.Methods.getData( Fugitivas.URLS.Base + grupo.ID_GRUPO_PONTO() + ".json", function ( result )
            {
                Fugitivas.ModelFugitivas.dadosModal( ko.mapping.fromJS( result ) );
                Fugitivas.ModelFugitivas.titleModal( grupo.NOME_GRUPO_PONTOS() );

                var $modal = $( '#modalPontos' );
                $modal.modal( { modal: true } );
                $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( Fugitivas.defaultImgNotes );

                Fugitivas.Methods.delegateEdit();
                Fugitivas.Methods.delegateView();

            } );
        }
        
    },

    editClick: function ()
    {
        if ($(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit")) {
            $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit", false)
            Fugitivas.ModelFugitivas.btnEditar("Editar");
        } else {
            $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit", true);
            Fugitivas.ModelFugitivas.btnEditar( "Concluir" );
        }
    },

    closeModal: function(){
        this.dadosModal([]);
        if (Fugitivas.ModelFugitivas.btnEditar() !== "Editar") {
            $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit", false);
            Fugitivas.ModelFugitivas.btnEditar( "Editar" );
        }

        $('#modalPontos').modal("hide");
        $(".viewport").html("").remove();
        
    },

    zoomOut: function(){
        $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "zoom", 1 );
    },

    init: function ()
    {

        Fugitivas.Methods.getData( Fugitivas.URLS.ListaGrupo, function ( result )
        {
            for (var i in result) {
                Fugitivas.ModelFugitivas.listaGrupoPontos.push( ko.mapping.fromJS( result[i] ) );
            }
        
        });
        Fugitivas.Methods.getData( Fugitivas.URLS.Componente, function ( resultComponente )
        {
            for (var i in resultComponente) {
                if (resultComponente[i].STATUS === "ativo") {
                    Fugitivas.ModelFugitivas.listagemComponente.push(ko.mapping.fromJS(resultComponente[i]));
                }
                
            }
        });
        Fugitivas.Methods.getData( Fugitivas.URLS.Fabricante, function ( resultFabricante )
        {
            for (var i in resultFabricante) {
                if (resultFabricante[i].STATUS === "ativo") {
                    Fugitivas.ModelFugitivas.listagemFabricante.push(ko.mapping.fromJS(resultFabricante[i]));
                }
                
            }
        });
        Fugitivas.Methods.getData( Fugitivas.URLS.Especialidade, function ( resultEspecialidade )
        {
            for (var i in resultEspecialidade) {
                if (resultEspecialidade[i].STATUS === "ativo") {
                    Fugitivas.ModelFugitivas.listagemEspecialidade.push(ko.mapping.fromJS(resultEspecialidade[i]));
                }

            }
            
        });
        
    }
};

ko.applyBindings( Fugitivas.ModelFugitivas );
Fugitivas.ModelFugitivas.init();

ko.bindingHandlers.fadeVisible = {
    init: function ( element, valueAccessor )
    {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $( element ).toggle( ko.unwrap( value ) ); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function ( element, valueAccessor )
    {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap( value ) ? $( element ).fadeIn() : $( element ).fadeOut();
    }
};