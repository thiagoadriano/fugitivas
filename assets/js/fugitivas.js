﻿///#source 1 1 /assets/js/system_fugitivas/component.js
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
                            var templateTag = Componente.SIGLA() + ( subComponente ? " - " + subComponente.SIGLA_SUBTIPO() : "" ) + " - " + result.HASH;
                            PontoNovo.HASH = hash;
                            pontos.push( ko.mapping.fromJS( PontoNovo ) );
                            Fugitivas.Methods.callbackCadastro(templateTag, ultimoPontoTag, { x: ultimoPonto.x, x: ultimoPonto.y });
                        }
                        Fugitivas.Notifica( result.type, result.mensagem );
                    } );

                } else
                {
                    var hash = Math.floor( Math.random() * 1000 );
                    var templateTag = Componente.SIGLA() + ( subComponente ? " - " + subComponente.SIGLA_SUBTIPO() : "" ) + " - " + hash;
                    PontoNovo.HASH = hash;
                    pontos.push( ko.mapping.fromJS( PontoNovo ) );
                    Fugitivas.Methods.callbackCadastro(templateTag, ultimoPontoTag, { x: ultimoPonto.x, y: ultimoPonto.y });
                    Fugitivas.Notifica( true, "Ponto Cadastrado com Sucesso!" );
                };
                
            },
            atualiza: function (data)
            {
                var pontos = Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO();
                var Componente = Fugitivas.Methods.getItemId( self.listType(), data.typeSelect() );
                var subComponente = data.subTypeSelect() !== "" ? Fugitivas.Methods.getItemId( Componente.SUBTIPO(), data.subTypeSelect() ) : "";
                var editPonto = ko.utils.arrayFirst( Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO(), function ( item )
                {
                    return Fugitivas.ModelFugitivas.idPonto() == item.ID();
                } );
                var templateTag = Componente.SIGLA() + ( subComponente ? " - " + subComponente.SIGLA_SUBTIPO() : "" ) + " - " + editPonto.HASH();
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
///#source 1 1 /assets/js/system_fugitivas/controller.js
var Fugitivas = Fugitivas || {};

Fugitivas.Methods = {
    validarCampos: function ()
    {
        var ids = ["tipo", "subtipo", "fabricante", "dimensao", "dimensao_medida", "posicao", "especialidade"];
        var ids2Tab = ["dimensao", "dimensao_medida", "posicao", "especialidade"];
        var id1Tab = ["tipo", "subtipo", "fabricante"];
        var idNotValid = [];
        for ( var i in ids )
        {
            var $this = $( "#" + ids[i] );
            if ( !$this.attr( "disabled" ) )
            {
                if ( $this.val() === "" )
                {
                    $this.addClass( "validation" );
                    idNotValid.push( ids[i] );
                } else
                {
                    $this.hasClass( "validation" ) ? $this.removeClass( "validation" ) : undefined;
                }
            }


        };

        if ( idNotValid.length )
        {
            for ( var j in ids2Tab )
            {
                if ( idNotValid[0] === ids2Tab[j] )
                {
                    var ativeCarac = $( '.nav-tabs a[aria-controls="caracteristicas"]' ).parent().hasClass( "active" );
                    if ( !ativeCarac )
                    {
                        $( '.nav-tabs a[aria-controls="caracteristicas"]' ).trigger( "click" );
                    }
                    $( "#" + idNotValid[0] ).focus();
                    return;
                } else
                {
                    for ( var t in id1Tab )
                    {
                        if ( idNotValid[0] === id1Tab[t] )
                        {
                            var ativeComp = $( '.nav-tabs a[aria-controls="componente"]' ).parent().hasClass( "active" );
                            if ( !ativeComp )
                            {
                                $( '.nav-tabs a[aria-controls="componente"]' ).trigger( "click" );

                            }

                            $( "#" + idNotValid[0] ).focus();
                            return;

                        }

                    }


                }
            }
        }

        return idNotValid.length ? 0 : 1;
    },
    getItemId: function ( list, id )
    {
        return ko.utils.arrayFirst( list, function ( item )
        {
            return parseInt( id ) == item.ID();
        } ) || "Not Found";
    },
    callbackCadastro: function ( tpl, tag, coord )
    {
        if ( Fugitivas.ModelFugitivas.flagSatatusPonto() === "new" )
        {
            $( "#NoteDialog" ).dialog( "close" );
        }
       
        var id = tag.attr( "data-id" );
        var posi = $( Fugitivas.CONTAINER_IMAGEM ).imgViewer( "imgToView", coord.x, coord.y );
        
        var idBaseName = tpl.replace( /\W/g, "" );
        var idFix = "fix-" + idBaseName;
        var idBase = "base-" + idBaseName;
        var idLabel = "label-" + idBaseName;
        var template = '<input type="hidden" name="idPoint" value="' + id + '"/>' +
                        '<span id="nomeTag">' + tpl + '</span>' +
                        '<button class="visualizar"><span class="glyphicon glyphicon-eye-open"></span></button>' +
                        '<button class="editar"><span class="glyphicon glyphicon-edit"></span></button>';

        var elem = $(document.createElement( 'div' ));
        elem
            .addClass( 'namePoint' )
            .attr( 'data-id', id )
            .attr( 'id', idLabel )
            .css( { top: posi.y, left: posi.x } )
            .append( template );

        $( Fugitivas.CONTAINER_IMAGEM ).imgViewer( "addElem", elem );
        $( Fugitivas.CONTAINER_IMAGEM ).imgViewer( "update" );
        

        tag.attr( "id", idFix )
                .removeClass( "pointInitial" )
                .addClass( 'fixPoint' );

        Fugitivas.Methods.createLine( {id:id} );
    },
    getLastID: function ()
    {
        var dados = Fugitivas.ModelFugitivas.dadosModal(),
                pontos = dados.MARCACAO_PONTO();
        var lastId = ( pontos.length ? parseInt( pontos[pontos.length - 1].ID() ) + 1 : 0 );
        return lastId;
    },
    getData: function ( urlLink, callback )
    {
        $.ajax( {
            url: urlLink,
            type: "GET",
            dataType: "json",
            cache: false,
            sync: true,
            success: function ( result )
            {
                if ( callback && typeof callback === "function" )
                {
                    callback( result );
                }

            },
            error: function ( e )
            {
                console.error( e );
            }
        } );


    },
    postData: function ( urlLink, dados, callback )
    {
        $.ajax( {
            url: urlLink,
            type: "POST",
            dataType: "json",
            data: dados,
            cache: false,
            sync: true,
            success: function ( result )
            {
                if ( callback && typeof callback === "function" )
                {
                    callback( result );
                }

            },
            error: function ( e )
            {
                console.error( e );
            }
        } );

    },
    createLine: function ( obj )
    {
        jsPlumb.ready( function ()
        {
            var instance = jsPlumb.getInstance({
                PaintStyle: {
                    lineWidth: 4,
                    strokeStyle: "#61B7CF",
                    outlineColor: "white",
                    outlineWidth: 0.5
                },
                Connector: ["Bezier", { curviness: 30 }],
                Endpoints: [null, ["Dot", { radius: 4 }]],
                EndpointStyles: [{fillStyle:""}, { fillStyle: '#7AB02C' }],
                MaxConnections: 1,
                ReattachConnections: true,
                Anchors: ["BottomCenter", [0.04, 0.12]],
                DragOptions: { cursor: "move", zIndex: 2000 },
                Container: "viewport"
            });

            instance.connect({
                source: $('.fixPoint[data-id="' + obj.id + '"]'),
                target: $('.namePoint[data-id="' + obj.id + '"]'),
                scope: "scope_" + obj.id
            });

            instance.draggable($('.namePoint[data-id="' + obj.id + '"]'));
        } );

    },
    delegateEdit: function ()
    {
        ( function ()
        {

            $( "#viewport" ).on( "click", ".editar", function ()
            {
                var id = $( this ).siblings( 'input[name="idPoint"]' ).val();
                Fugitivas.ModelFugitivas.flagSatatusPonto( "edit" );
                Fugitivas.ModelFugitivas.idPonto( id );
                if ( Fugitivas.ModelFugitivas.flagSatatusPonto() === "edit" )
                {
                    Fugitivas.Methods.dialogOpen( "Editar Ponto", $( this ) );
                }

            } );

        }
        )();
    },
    delegateView: function(){
        (function()
        {
        
            $( "#viewport" ).on( "click", ".visualizar", function ()
            {
                var id = $( this ).siblings( 'input[name="idPoint"]' ).val();
                Fugitivas.ModelFugitivas.flagSatatusPonto( "view" );
                Fugitivas.ModelFugitivas.idPonto( id );

                if ( Fugitivas.ModelFugitivas.flagSatatusPonto() === "view" )
                {
                    Fugitivas.Methods.dialogOpen( "Visualizar Ponto", $( this ) );
                }


            } );
        
        }
        )();
    },
    dialogOpen: function (title, elem)
    {
       $( '#NoteDialog' ).remove();
       $( '<div id="NoteDialog"></div>' ).dialog( {
            title: title,
            resizable: false,
            draggable: true,
            modal: true,
            closeOnEscape: false,
            closeText: "hide",
            height: "280",
            width: "400",
            position: { my: "left top", at: "right bottom", of: elem },
            open: function ( event, ui )
            {
                $( this ).css( "overflow", "hidden" );
                $( '.ui-dialog-titlebar-close' ).remove();
                $( this ).attr( "data-bind", "component: {name: 'form-content', params:{tipos: listagemComponente, fabricantes: listagemFabricante, especialidade: listagemEspecialidade} }" );
                ko.applyBindings( Fugitivas.ModelFugitivas, $( "#NoteDialog" )[0] );
            }
        } )
    },
    buscaComponetes:function(idComponente, idSubComponente)
    {
        var componentes = Fugitivas.ModelFugitivas.listagemComponente();
        var resultComponente = "";
        var resultSubComponete = "";

        for ( var comp in componentes )
        {
            if ( componentes[comp].ID() === idComponente.toString() )
            {
                resultComponente = componentes[comp];
                for ( var sub in componentes[comp].SUBTIPO() )
                {
                    if ( componentes[comp].SUBTIPO().length > 0 && componentes[comp].SUBTIPO()[sub].ID() === idSubComponente.toString() )
                    {
                        resultSubComponete = componentes[comp].SUBTIPO()[sub].SIGLA_SUBTIPO();
                        break;
                    } else if ( componentes[comp].SUBTIPO().length === 0 )
                    {
                        break;
                    }
                }

            } else if ( componentes.length === 0)
            {
                break;
            }
        };

        return {
            tipo: resultComponente,
            subtipo: resultSubComponete
        };

    },
    carregaPontos: function ()
    {
        var pontos = Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO();
        var totalPontos = pontos.length;
        

        Fugitivas.ModelFugitivas.flagSatatusPonto( "insert" );

        for(var i = 0; i < totalPontos; i++){
            var Componente = Fugitivas.Methods.buscaComponetes( pontos[i].DADOS_PONTO.TIPO_COMPONENTE(), pontos[i].DADOS_PONTO.SUBTIPO_COMPONENTE() );
            Fugitivas.ModelFugitivas.idPonto( pontos[i].ID() );

            $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( 'addNote', pontos[i].COORDS.X(), pontos[i].COORDS.Y(), null );

            var ultimoPontoTag = $( ".markerPoint" ).last();
            ultimoPontoTag.off( "click" );

            var templateTag = Componente.tipo.SIGLA() + ( Componente.subtipo !== "" ? " - " + Componente.subtipo : "" ) + " - " + pontos[i].HASH();
            Fugitivas.Methods.callbackCadastro( templateTag, ultimoPontoTag, { x: pontos[i].COORDS.X(), y: pontos[i].COORDS.Y() } );
        }

        Fugitivas.ModelFugitivas.flagSatatusPonto( "new" );
        
        
    },
    dispararEventos: function ()
    {
        $( '#modalPontos' ).modal( "show" );

        $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( Fugitivas.defaultImgNotes );

        $( '#viewport > img' ).one( 'load', function ()
        {
            Fugitivas.Methods.delegateEdit();
            Fugitivas.Methods.delegateView();
            if ( Fugitivas.ModelFugitivas.dadosModal().MARCACAO_PONTO().length )
            {
                Fugitivas.Methods.carregaPontos();
            }
        } ).each( function ()
        {
            if ( $( this ).get( 0 ).complete ){
                $( this ).load();
            }
        } )
        

    },
    preencheModal: function ( obj )
    {
        Fugitivas.ElModal.EMPRESA.val( obj.EMPRESA() );
        Fugitivas.ElModal.NIVEL1.val( obj.NIVEL1() );
        Fugitivas.ElModal.NIVEL2.val( obj.NIVEL2() );
        Fugitivas.ElModal.NIVEL3.val( obj.NIVEL3() );
        Fugitivas.ElModal.UNIDADE_PROCESSO.val( obj.UNIDADE_PROCESSO() );
        Fugitivas.ElModal.LINHA_PROCESSO.val( obj.LINHA_PROCESSO() );
        Fugitivas.ElModal.TAG_EQUIPAMENTO.val( obj.TAG_EQUIPAMENTO() );
        Fugitivas.ElModal.POSICAO_GRUPO.val( obj.POSICAO_GRUPO() );
        Fugitivas.ElModal.FLUXOGRAMA.val( obj.FLUXOGRAMA() );
        Fugitivas.ElModal.NOTA.val( obj.NOTA() );
        Fugitivas.ElModal.IMAGEM.attr( 'src', 'imagem/' + obj.IMG_NAME() );
    }
};
///#source 1 1 /assets/js/system_fugitivas/default.js
var Fugitivas = Fugitivas || {};

//ID DO CONTAINER DE IMAGEM PARA USO DO COMPONENTE
Fugitivas.CONTAINER_IMAGEM = "#MainContentIMG";

//URLS PARA USO DO SISTEMA
Fugitivas.URLS = {};
Fugitivas.URLS.Base          = "/json_dados/";
Fugitivas.URLS.Especialidade = Fugitivas.URLS.Base + "_especialidade.json";
Fugitivas.URLS.Componente    = Fugitivas.URLS.Base + "_componente.json";
Fugitivas.URLS.ListaGrupo    = Fugitivas.URLS.Base + "_lista_de_grupo.json";
Fugitivas.URLS.Fabricante    = Fugitivas.URLS.Base + "_fabricantes.json";
Fugitivas.URLS.Deletar       = undefined;
Fugitivas.URLS.Salvar        = undefined;
Fugitivas.URLS.Atualizar     = undefined;

//CONFIGURAÇÂO PADRÂO DO COMPONENTE
Fugitivas.defaultImgNotes = {
    onAdd: function ()
    {
        this.options.vAll = "bottom";
        this.options.hAll = "middle";

        var elem = $( document.createElement( 'div' ) );
        elem.addClass( "markerPoint pointInitial" );

        if ( Fugitivas.ModelFugitivas.flagSatatusPonto() !== "insert" )
        {
            elem.attr( "data-id", Fugitivas.Methods.getLastID() );
        }
        else
        {
            elem.attr( "data-id", Fugitivas.ModelFugitivas.idPonto() );
        }
            
        return elem;
    },
    onEdit: function ( ev, elem )
    {
        var $elem = $( elem );
        Fugitivas.ModelFugitivas.flagSatatusPonto( "new" );
        Fugitivas.ModelFugitivas.idPonto( Fugitivas.Methods.getLastID() );
        return Fugitivas.Methods.dialogOpen( "Adicionar Ponto", elem);
    }
};


//Elemetnos do Modal
Fugitivas.ElModal = {
    tituloModal: $( '#tituloModal' ),
    EMPRESA: $( '#EMPRESA' ),
    NIVEL1: $( '#NIVEL1' ),
    NIVEL2: $( '#NIVEL2' ),
    NIVEL3: $( '#NIVEL3' ),
    UNIDADE_PROCESSO: $( '#UNIDADE_PROCESSO' ),
    LINHA_PROCESSO: $( '#LINHA_PROCESSO' ),
    TAG_EQUIPAMENTO: $( '#TAG_EQUIPAMENTO' ),
    POSICAO_GRUPO: $( '#POSICAO_GRUPO' ),
    FLUXOGRAMA: $( '#FLUXOGRAMA' ),
    NOTA: $( '#NOTA' ),
    IMAGEM: $(Fugitivas.CONTAINER_IMAGEM),
    zoomOut: $( '#zoomOut' ),
    editClick: $( '#editClick' ),
    FecharModal: $( '#FecharModal' ),
    openModal: $( '#grupo' )
};

//ALERTA DE ERRO OU SUCESSO
Fugitivas.Notifica = function ( boolNotifica, msg )
{
    var typeMsg = boolNotifica ? "notifica-ok" : "notifica-erro";
    var typeIcon = boolNotifica ? "glyphicon-ok-sign" : "glyphicon-remove-sign";
    var tpl = '<div id="notifica" class="' + typeMsg + '" style="display:none;">' +
                '<p>' +
                    '<span class="glyphicon ' + typeIcon + '"></span>' +
                        msg +
                '</p>' +
                '</div>';

    if ( $( '#notifica' ).length ) $( '#notifica' ).remove();

    $( 'body' ).append( tpl );
    $( '#notifica' )
        .fadeIn( 1000 )
        .delay( 3000 )
        .fadeOut( 1000, function ()
            {
                $( this ).remove();
            } );


};

///#source 1 1 /assets/js/system_fugitivas/eventos.js
$( function ()
{
    $( '#containerLoading' ).css( 'height', $( document ).height() );
    $.ajaxSetup( {
        beforeSend: function ()
        { 
            $( '#containerLoading' ).fadeIn( 'slow' );

        },
        complete: function ()
        {
            $( '#containerLoading' ).fadeOut( 'slow');

        }
    } );

    Fugitivas.ElModal.FecharModal.on( 'click', function ()
    {
        $( '#modalPontos' ).modal( "hide" );
        Fugitivas.ElModal.IMAGEM.attr( 'src', '' );
        $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( 'destroy' );

    } );

    Fugitivas.ElModal.openModal.on('click', '.openModal', function(){
        var idGrupo = $( this ).attr( 'data-id-grupo' );
        var titulo = $( this ).parents( 'tr' ).find( ".nomeGrupo" ).text();
        if ( idGrupo != "" )
        {       
            Fugitivas.Methods.getData( Fugitivas.URLS.Base + idGrupo + ".json", function ( result )
            {   
                Fugitivas.ModelFugitivas.dadosModal( ko.mapping.fromJS( result ) );
                Fugitivas.ElModal.tituloModal.text( titulo );
                Fugitivas.Methods.preencheModal( Fugitivas.ModelFugitivas.dadosModal() );
                Fugitivas.Methods.dispararEventos();
            } );
        }
    } )

    Fugitivas.ElModal.editClick.on( 'click', function ()
    {
        if ( $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "canEdit" ) )
        {
            $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "canEdit", false )
            $(this).text( "Editar" );
        } else
        {
            $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "canEdit", true );
            $( this ).text( "Concluir" );
        }
    } );

    Fugitivas.ElModal.zoomOut.on( 'click', function ()
    {
        $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "zoom", 1 );
    } );

} );
///#source 1 1 /assets/js/system_fugitivas/model.js
var Fugitivas = Fugitivas || {};

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
