﻿var Fugitivas = Fugitivas || {};

Fugitivas.ModelFugitivas =
 {
    self: this,
    titleModal : ko.observable(),
    listaGrupoPontos: ko.observableArray(),
    editModelFugitivas: ko.observable(),
    pathIMg: "imagem/",
    dadosModal: ko.observableArray(),
    listaPontos: ko.observableArray(),
    btnEditar: ko.observable("Editar"),
    listagemComponente: ko.observableArray(),
    listagemEspecialidade: ko.observableArray(),
    listagemFabricante: ko.observableArray(),
    flagSatatusPonto: ko.observable(),
    idPonto: ko.observable(),

    openModal: function (grupo)
    {
        if ( grupo.ID_GRUPO_PONTO() != "" )
        {
            Fugitivas.ModelFugitivas.dadosModal( [] );

            Fugitivas.Methods.getData( Fugitivas.URLS.Base + grupo.ID_GRUPO_PONTO() + ".json", function ( result )
            {                
                Fugitivas.ModelFugitivas.dadosModal( ko.mapping.fromJS( result ) );
                Fugitivas.ModelFugitivas.titleModal( grupo.NOME_GRUPO_PONTOS() );
                Fugitivas.Methods.dispararEventos();
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

    zoomOut: function(){
        $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "zoom", 1 );
    },

    initcial: function ()
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
Fugitivas.ModelFugitivas.initcial();

ko.bindingHandlers.fadeVisible = {
    init: function ( element, valueAccessor )
    {
        var value = valueAccessor();
        $( element ).toggle( ko.unwrap( value ) );
    },
    update: function ( element, valueAccessor )
    {
        var value = valueAccessor();
        ko.unwrap( value ) ? $( element ).fadeIn() : $( element ).fadeOut();
    }
};
