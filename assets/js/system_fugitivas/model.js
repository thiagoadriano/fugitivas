var Fugitivas = Fugitivas || {};

'use strict';
Fugitivas.ModelFugitivas =
 {
    listaGrupoPontos: ko.observableArray(),
    dadosModal: ko.observable(),
    listaPontos: ko.observableArray(),
    listagemComponente: ko.observableArray(),
    listagemEspecialidade: ko.observableArray(),
    listagemFabricante: ko.observableArray(),
    flagSatatusPonto: ko.observable(),
    idPonto: ko.observable(),
    nomeExclude: ko.observable(),
    idExclude: ko.observable(),

    deleteGroup: function () {
        var id = Fugitivas.ModelFugitivas.idExclude();
        if (Fugitivas.URLS.RemoverGrupo) {
            Fugitivas.Methods.postData(Fugitivas.URLS.RemoverGrupo, { id: id }, function (result) {
                if (result.type) {
                    var objetoAtual = Fugitivas.Methods.getItemId(Fugitivas.ModelFugitivas.listaGrupoPontos(), id);
                    Fugitivas.ModelFugitivas.listaGrupoPontos.remove(objetoAtual);
                    Fugitivas.ModelFugitivas.closeModalExclude();
                }
                Fugitivas.Notifica(result.type, result.mensagem);
            });
        } else {
            var objetoAtual = Fugitivas.Methods.getItemId(Fugitivas.ModelFugitivas.listaGrupoPontos(), id);
            Fugitivas.ModelFugitivas.listaGrupoPontos.remove(objetoAtual);
            Fugitivas.ModelFugitivas.closeModalExclude();
            Fugitivas.Notifica(true, "Grupo Removido com sucesso!");
        }
        
    },

    deleteGroupConfirm: function (data) {
        Fugitivas.ModelFugitivas.nomeExclude(data.NOME_GRUPO_PONTOS());
        Fugitivas.ModelFugitivas.idExclude(data.ID());
        $('#confirmDelete').modal('show');
    },

    closeModalExclude: function(){
        $('#confirmDelete').modal('hide');
        Fugitivas.ModelFugitivas.nomeExclude("");
        Fugitivas.ModelFugitivas.idExclude("");
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
