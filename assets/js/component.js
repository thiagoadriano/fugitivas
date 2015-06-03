/// <reference path="../../Scripts/_references.js" />
var Fugitivas = Fugitivas || {};

'use strict';
ko.components.register( 'form-content', {
    viewModel: function (params) {
        var self = this;
        var objeto = Fugitivas.ModelFugitivas.flagSatatusPonto() !== "new" ? 
            ko.utils.arrayFirst( Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO(), function ( item )
                {
                    return Fugitivas.ModelFugitivas.idPonto() == item.ID();
                } ) : undefined;
        self.listType = params.tipos;
        self.listManufacturers = params.fabricantes;
        self.listSpecialty = params.especialidade;
        self.listSubtype = ko.observableArray([{ NOME: "Selecione um Tipo com Subtipo", ID: "" }]);
        self.typeSelect = ko.observable();
        self.subTypeSelect = ko.observable();
        self.manufactSelect = ko.observable();
        self.dimmerSelect = ko.observable();
        self.dimmerComboSelect = ko.observable();
        self.positionSelect = ko.observable();
        self.specialtySelect = ko.observable();
        self.flagDeletar = ko.observable( false );

        self.save = {
            novo: function (data)
            {
                var pontos = Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO();
                var novaId = Fugitivas.Methods.getLastID();
                var dadosPontoImagem = $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "export" );
                var ultimoPonto = dadosPontoImagem[dadosPontoImagem.length - 1];
                var ultimoPontoTag = $( ".markerPoint" ).last();
                var Componente = Fugitivas.Methods.getItemId( self.listType(), data.typeSelect() );
                var subComponente = data.subTypeSelect() !== "" ? Fugitivas.Methods.getItemId( Componente.SUBTIPO(), data.subTypeSelect() ) : "";
                var templateTag = Componente.SIGLA() + ( subComponente ? " - " + subComponente.SIGLA_SUBTIPO() : "" ) + " - " + Math.floor( Math.random() * 1000 );

                ultimoPontoTag.off( "click" );

                var PontoNovo = {
                    ID: novaId,
                    COORDS: { X: ultimoPonto.x, Y: ultimoPonto.y },
                    DADOS_PONTO: {
                        TIPO_COMPONENTE: data.typeSelect(),
                        SUBTIPO_COMPONENTE: data.subTypeSelect(),
                        FABRICANTE: data.manufactSelect(),
                        DIMENSAO: data.dimmerSelect(),
                        MEDIDA_DIMENSAO: data.dimmerComboSelect(),
                        POSICAO_PONTO: data.positionSelect(),
                        ESPECIALIDADE_PONTO: data.specialtySelect()
                    }
                };




                if ( Fugitivas.URLS.Salvar )
                {
                    Fugitivas.Methods.postData( Fugitivas.URLS.Salvar + Fugitivas.ModelFugitivas.dadosModal().ID(), JSON.stringify( PontoNovo ), function ( result )
                    {
                        if ( result.type )
                        {
                            pontos.push( ko.mapping.fromJS( PontoNovo ) );
                            Fugitivas.Methods.callbackCadastro( templateTag, ultimoPontoTag );
                        }
                        Fugitivas.Notifica( result.type, result.mensagem )
                    } );

                } else
                {
                    pontos.push( ko.mapping.fromJS(PontoNovo) );
                    Fugitivas.Methods.callbackCadastro( templateTag, ultimoPontoTag );
                    Fugitivas.Notifica( true, "Ponto Cadastrado com Sucesso!" );
                };

            },
            atualiza: function (data)
            {
                var pontos = Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO();
                var Componente = Fugitivas.Methods.getItemId( self.listType(), data.typeSelect() );
                var subComponente = data.subTypeSelect() !== "" ? Fugitivas.Methods.getItemId( Componente.SUBTIPO(), data.subTypeSelect() ) : "";
                var templateTag = Componente.SIGLA() + ( subComponente ? " - " + subComponente.SIGLA_SUBTIPO() : "" ) + " - " + Math.floor( Math.random() * 1000 );
                var editPonto = ko.utils.arrayFirst( Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO(), function ( item )
                {
                    return Fugitivas.ModelFugitivas.idPonto() == item.ID();
                } );
                var PontoEditado = {
                    ID_GRUPO: Fugitivas.ModelFugitivas.dadosModal().ID(),
                    ID: Fugitivas.ModelFugitivas.idPonto(),
                    DADOS_PONTO: {
                        TIPO_COMPONENTE: data.typeSelect(),
                        SUBTIPO_COMPONENTE: data.subTypeSelect(),
                        FABRICANTE: data.manufactSelect(),
                        DIMENSAO: data.dimmerSelect(),
                        MEDIDA_DIMENSAO: data.dimmerComboSelect(),
                        POSICAO_PONTO: data.positionSelect(),
                        ESPECIALIDADE_PONTO: data.specialtySelect()
                    }
                };

                if ( Fugitivas.URLS.Atualizar )
                {
                    Fugitivas.Methods.postData(Fugitivas.URLS.Atualizar + Fugitivas.ModelFugitivas.dadosModal().ID(), JSON.stringify(PontoEditado), function(result){
                        if(result.type){
                            editPonto.DADOS_PONTO.TIPO_COMPONENTE( data.typeSelect() );
                            editPonto.DADOS_PONTO.SUBTIPO_COMPONENTE( data.subTypeSelect() );
                            editPonto.DADOS_PONTO.FABRICANTE( data.manufactSelect() );
                            editPonto.DADOS_PONTO.DIMENSAO( data.dimmerSelect() );
                            editPonto.DADOS_PONTO.MEDIDA_DIMENSAO( data.dimmerComboSelect() );
                            editPonto.DADOS_PONTO.POSICAO_PONTO( data.positionSelect() );
                            editPonto.DADOS_PONTO.ESPECIALIDADE_PONTO( data.specialtySelect() );
                            $( ".namePoint[data-id='" + Fugitivas.ModelFugitivas.idPonto() + "']" ).find( "#nomeTag" ).text( templateTag );
                            $( "#NoteDialog" ).dialog( "close" );
                        }
                        Fugitivas.Notifica(result.type, result.mensagem);
                    });
                } else
                {
                    
                    editPonto.DADOS_PONTO.TIPO_COMPONENTE( data.typeSelect() );
                    editPonto.DADOS_PONTO.SUBTIPO_COMPONENTE( data.subTypeSelect());
                    editPonto.DADOS_PONTO.FABRICANTE( data.manufactSelect());
                    editPonto.DADOS_PONTO.DIMENSAO( data.dimmerSelect());
                    editPonto.DADOS_PONTO.MEDIDA_DIMENSAO( data.dimmerComboSelect());
                    editPonto.DADOS_PONTO.POSICAO_PONTO( data.positionSelect());
                    editPonto.DADOS_PONTO.ESPECIALIDADE_PONTO( data.specialtySelect() );
                    $( ".namePoint[data-id='" + Fugitivas.ModelFugitivas.idPonto() + "']" ).find( "#nomeTag" ).text( templateTag );
                    $( "#NoteDialog" ).dialog( "close" );
                    Fugitivas.Notifica( true, "Ponto atualizado com Sucesso!" );
                };
            }
        }
        
        ko.bindingHandlers.numeric = {
            init: function ( element, valueAcessor )
            {
                function remove(el)
                {
                    var value = el.val().toString();
                    value = value.replace( /\D/, "" );
                    return value;
                }
                $( element ).on( {
                    keypress: function ( event )
                    {
                        $( this ).val( remove( $(this) ) );

                    },
                    keyup: function ( event )
                    {
                        $( this ).val( remove( $( this ) ) );

                    },
                    blur: function ( event )
                    {
                        $( this ).val( remove( $( this ) ) );

                    }
                } );
 
            }
        };

        ko.bindingHandlers.dadosInicial = {
            init: function ()
            {
                if ( Fugitivas.ModelFugitivas.flagSatatusPonto() !== "new" && objeto !== undefined )
                {
                    self.typeSelect( objeto.DADOS_PONTO.TIPO_COMPONENTE() );
                    self.subTypeSelect( objeto.DADOS_PONTO.SUBTIPO_COMPONENTE() );
                    self.manufactSelect( objeto.DADOS_PONTO.FABRICANTE() );
                    self.dimmerSelect( objeto.DADOS_PONTO.DIMENSAO() );
                    self.dimmerComboSelect( objeto.DADOS_PONTO.MEDIDA_DIMENSAO() );
                    self.positionSelect( objeto.DADOS_PONTO.POSICAO_PONTO() );
                    self.specialtySelect( objeto.DADOS_PONTO.ESPECIALIDADE_PONTO() );
                };
            }
        }
        
        self.typeSelect.subscribe(
            function (data) {
                self.listSubtype([]);
                var objetoComponente = self.listType()[data];

                if (objetoComponente !== undefined && objetoComponente.SUBTIPO().length) {
                    for (var i in objetoComponente.SUBTIPO()) {
                        self.listSubtype.push(objetoComponente.SUBTIPO()[i]);
                    };
                }
                else {
                    self.listSubtype.push({ NOME: "Selecione um Tipo com Subtipo", ID: "" });
                }

            }
        );

        self.savePoint = function (data) {
           
            if ( Fugitivas.Methods.validarCampos() )
            {
                if ( Fugitivas.ModelFugitivas.flagSatatusPonto() === "new" )
                {
                    self.save.novo( data );
                }
                else if ( Fugitivas.ModelFugitivas.flagSatatusPonto() === "edit" )
                {
                    self.save.atualiza(data);
                }
                
            };


        };

        self.close = function () {
            if (self.novoPonto) {
                var div = $( ".markerPoint" )[$( ".markerPoint" ).length - 1];
                $(div).trigger("remove");
                $("#NoteDialog").dialog("close");
            } else {
                $("#NoteDialog").dialog("close");
            }
        };

        self.deleted = function ( )
        {
            self.flagDeletar( true );
        };

        self.noDeletar = function ()
        {
            self.flagDeletar( false );
        };

        self.yesDeletar = function ()
        {
           
            if ( Fugitivas.ModelFugitivas.idPonto() !== "" && Fugitivas.ModelFugitivas.idPonto() !== undefined )
            {
                if ( Fugitivas.ModelFugitivas.flagSatatusPonto() !== "new" )
                {
                    
                    if ( Fugitivas.URLS.Deletar )
                    {
                        Fugitivas.Methods.postData( Fugitivas.URLS.Deletar + Fugitivas.ModelFugitivas.idPonto(), objeto, function ( result )
                        {
                            if ( result.type )
                            {
                                
                                Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO.remove( objeto );
                                var nodeFix = document.querySelector( '.fixPoint[data-id="' + Fugitivas.ModelFugitivas.idPonto() + '"]' );
                                var nodePoint = document.querySelector( '.namePoint[data-id="' + Fugitivas.ModelFugitivas.idPonto() + '"]' );
                                if ( nodeFix.parentNode )
                                {
                                    nodeFix.parentNode.removeChild( nodeFix );
                                    nodePoint.parentNode.removeChild( nodePoint );
                                }

                            }
                            Fugitivas.Notifica( result.type, result.mensagem );
                        } );

                    } else
                    {
                        Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO.remove( objeto );
                        var nodeFix = document.querySelector( '.fixPoint[data-id="' + Fugitivas.ModelFugitivas.idPonto() + '"]' );
                        var nodePoint = document.querySelector( '.namePoint[data-id="' + Fugitivas.ModelFugitivas.idPonto() + '"]' );
                        if ( nodeFix.parentNode )
                        {
                            nodeFix.parentNode.removeChild( nodeFix );
                            nodePoint.parentNode.removeChild( nodePoint );
                        }
                        
                        Fugitivas.Notifica( true, "Ponto Deletado com Sucesso!" );
                    }
                } else
                {
                    var node = document.querySelector( '.pointInitial[data-id="' + Fugitivas.ModelFugitivas.idPonto() + '"]' );
                    if ( node.parentNode )
                    {
                        node.parentNode.removeChild( node );
                    }
                    
                }
                $( "#NoteDialog" ).dialog( "close" );
            }

        }
        
    },
    template: '<form id="fromDados" class="form-horizontal" data-bind="dadosInicial">' +
                '<div role="tabpanel">'+
                    '<ul class="nav nav-tabs" role="tablist">'+
                        '<li role="presentation" class="active">'+
                            '<a href="#componente" aria-controls="componente" role="tab" data-toggle="tab">Componente</a>'+
                        '</li>'+
                        '<li role="presentation">'+
                            '<a href="#caracteristicas" aria-controls="caracteristicas" role="tab" data-toggle="tab">Características</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>'+
                '<div class="tab-content">'+
                    '<div role="tabpanel" class="tab-pane fade in active" id="componente">'+
                        '<div class="form-group">'+
                            '<label class="col-md-4 control-label" for="tipo">* Tipo: </label>'+
                            '<div class="col-md-8">'+
                                '<select id="tipo" class="form-control input-sm" data-bind="enable: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\' && flagDeletar() == false, options: listType, optionsText: \'COMPONENTE\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value: typeSelect"></select>' +
                            '</div>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label class="col-md-4 control-label" for="subtipo">* Subtipo: </label>'+
                            '<div class="col-md-8">'+
                                '<select id="subtipo" class="form-control input-sm" data-bind="enable: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\' && subTypeSelect() != \'\' && subTypeSelect() != undefined && flagDeletar() == false, options: listSubtype, optionsText: \'NOME\', optionsValue: \'ID\', value: subTypeSelect"></select>' +
                            '</div>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label class="col-md-4 control-label" for="fabricante">* Fabricante: </label>'+
                            '<div class="col-md-8">'+
                                '<select id="fabricante" class="form-control input-sm" data-bind="enable: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\' && flagDeletar() == false, options: listManufacturers, optionsText: \'RAZAO_SOCIAL\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value: manufactSelect"></select>' +
                            '</div>'+
                         '</div>'+
                   '</div>'+
                   '<div role="tabpanel" class="tab-pane fade" id="caracteristicas">'+
                        '<div class="form-group">'+
                            '<label class="col-md-5 control-label" for="dimensao">* Dimensão do componente: </label>'+
                            '<div class="col-md-3">'+
                                '<input type="text" id="dimensao" class="form-control input-sm" data-bind="enable: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\' && flagDeletar() == false, value: dimmerSelect, numeric: dimmerSelect">' +
                            '</div>'+
                            '<div class="col-md-4">'+
                                '<select id="dimensao_medida" class="form-control input-sm" data-bind="enable: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\' && flagDeletar() == false, value: dimmerComboSelect">' +
                                    '<option value="0">Polegadas</option>'+
                                    '<option value="1">Milímetros</option>'+
                                '</select>'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label class="col-md-5 control-label" for="posicao">* Posição do ponto: </label>'+
                            '<div class="col-md-7">'+
                                '<input type="text" id="posicao" data-bind="enable: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\' && flagDeletar() == false, value: positionSelect"class="form-control input-sm">' +
                            '</div>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label class="col-md-5 control-label" for="especialidade">* Especialidade do ponto: </label>'+
                            '<div class="col-md-7">'+
                                '<select id="especialidade" class="form-control input-sm" data-bind="enable: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\' && flagDeletar() == false, options: listSpecialty, optionsText: \'ESPECIALIDADE\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value:specialtySelect"></select>' +
                            '</div>'+
                        '</div>'+
                   '</div>'+
                   '<div class="row">'+
                       '<div class="col-md-3 col-md-offset-2">'+
                            '<button type="submit" class="btn btn-success btn-block" data-bind="visible: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\', enable: flagDeletar() == false, click: savePoint">Salvar</button>' +
                       '</div>'+
                       '<div class="col-md-3">'+
                            '<button type="button" class="btn btn-danger btn-block" data-bind="visible: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'view\', enable: flagDeletar() == false, click: deleted">Deletar</button>' +
                       '</div>'+
                       '<div class="col-md-3">'+
                            '<button type="button" class="btn btn-default btn-block" data-bind="visible: Fugitivas.ModelFugitivas.flagSatatusPonto() != \'new\', enable: flagDeletar() == false, click: close">Fechar</button>' +
                       '</div>'+
                   '</div>' +
                   '<div class="row rowDelet" data-bind="fadeVisible: flagDeletar">' +
                       '<div class="col-md-12">' +
                            '<h2>Deseja realmente deletar este ponto?</h2>' +
                       '</div>' +
                   '</div>' +
                   '<div class="row rowDelet" data-bind="fadeVisible: flagDeletar">' +
                       '<div class="col-md-4 col-md-offset-2">' +
                            '<button type="submit" class="btn btn-danger btn-block btn-xs" data-bind="click: yesDeletar">Sim</button>' +
                       '</div>' +
                       '<div class="col-md-4">' +
                            '<button type="button" class="btn btn-primary btn-block btn-xs" data-bind="click: noDeletar">Não</button>' +
                       '</div>' +
                   '</div>' +
              '</div>'+
           '</form>'
});