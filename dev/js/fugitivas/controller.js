'use strict';
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

        var idBaseName = tpl.replace( /\W/g, "" );
        var idFix = "fix-" + idBaseName;
        var idBase = "base-" + idBaseName;
        var idLabel = "label-" + idBaseName;
        var template = '<input type="hidden" name="idPoint" value="' + id + '"/>' +
                        '<span id="nomeTag">' + tpl + '</span>' +
                        '<button class="visualizar" data-toggle="tooltip" data-placement="top" title="Visualizar"><span class="glyphicon glyphicon-eye-open"></span></button>' +
                        '<button class="editar" data-toggle="tooltip" data-placement="top" title="Editar"><span class="glyphicon glyphicon-edit"></span></button>';
        var elem = $(document.createElement( 'div' ));
        elem
            .addClass( 'namePoint' )
            .attr( 'data-id', id )
            .attr( 'id', idLabel )
            .css({ top: coord.top, left: coord.left })
            .append( template );

        $( Fugitivas.CONTAINER_IMAGEM ).imgViewer( "addElem", elem );
        $( Fugitivas.CONTAINER_IMAGEM ).imgViewer( "update" );


        tag.attr( "id", idFix )
           .removeClass( "pointInitial" )
           .addClass('fixPoint');

        $('.editar, .visualizar').tooltip();
    },
    getLastID: function ()
    {
        var dados = Fugitivas.ModelFugitivas.dadosModal(),
                pontos = dados.PONTO_MEDICAO();
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
    createLine: function ()
    {
        jsPlumb.ready( function ()
        {
            Fugitivas.conectionInstance = jsPlumb.getInstance(Fugitivas.defaultJSPlumb);
            Fugitivas.conectionInstance.batch(function () {
                var dados = Fugitivas.ModelFugitivas.dadosModal().PONTO_MEDICAO();
                if (dados.length) {
                    for (var i in dados) {
                        var id = dados[i].ID();
                        Fugitivas.Methods.connect(id);
                    };
                };
            });
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
    delegateView: function()
    {
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
    dialogOpen: function ( title, elem )
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
                $( this ).attr( "data-bind", "component: {name: 'form-content', params:{tipos: listagemComponente, fabricantes: listagemFabricante, especialidade: listagemEspecialidade, posicaoPonto: listagemPosicaoPonto} }" );
                ko.applyBindings( Fugitivas.ModelFugitivas, $( "#NoteDialog" )[0] );
            }
        } )
    },
    buscaComponetes:function( idComponente, idSubComponente )
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
        var pontos = Fugitivas.ModelFugitivas.dadosModal().PONTO_MEDICAO();
        var totalPontos = pontos.length;

        if (pontos.length) {
            Fugitivas.ModelFugitivas.flagSatatusPonto("insert");

            for(var i = 0; i < totalPontos; i++){
                var Componente = Fugitivas.Methods.buscaComponetes( pontos[i].DADOS_PONTO.TIPO_COMPONENTE(), pontos[i].DADOS_PONTO.SUBTIPO_COMPONENTE() );
                Fugitivas.ModelFugitivas.idPonto( pontos[i].ID() );

                $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( 'addNote', pontos[i].COORDS.X(), pontos[i].COORDS.Y(), null );

                var ultimoPontoTag = $( ".markerPoint" ).last();
                ultimoPontoTag.off( "click" );

                var templateTag = Componente.tipo.SIGLA() + ( Componente.subtipo !== "" ? " - " + Componente.subtipo : "" ) + " - " + pontos[i].HASH();
                Fugitivas.Methods.callbackCadastro(templateTag, ultimoPontoTag, { top: pontos[i].POSICAO_TAG.TOP(), left: pontos[i].POSICAO_TAG.LEFT() });
            }

            Fugitivas.ModelFugitivas.flagSatatusPonto( "new" );
        }

    },
    dispararEventos: function ()
    {
        $( '#modalPontos' ).modal( "show" );

        $(Fugitivas.CONTAINER_IMAGEM).imgNotes(Fugitivas.defaultImgNotes);

        $('#viewport > img').hide().on('load', function () {

            setTimeout(function () {
                $(Fugitivas.CONTAINER_IMAGEM).imgViewer("update");
                $('#viewport > img').show();
                Fugitivas.Methods.delegateEdit();
                Fugitivas.Methods.delegateView();
                Fugitivas.Methods.carregaPontos();
                Fugitivas.Methods.createLine();
            }, 600);
        });


    },
    preencheModal: function ( obj )
    {
        Fugitivas.ElModal.UNIDADE_PROCESSO.val( obj.UNIDADE_PROCESSO() );
        Fugitivas.ElModal.LINHA_PROCESSO.val( obj.LINHA_PROCESSO() );
        Fugitivas.ElModal.TAG_EQUIPAMENTO.val( obj.TAG_EQUIPAMENTO() );
        Fugitivas.ElModal.POSICAO_GRUPO.val( obj.POSICAO_GRUPO() );
        Fugitivas.ElModal.FLUXOGRAMA.val( obj.FLUXOGRAMA() );
        Fugitivas.ElModal.NOTA.val(obj.NOTA());
        Fugitivas.ElModal.SITUACAO.val(obj.SITUACAO());
        Fugitivas.ElModal.IMAGEM.attr( 'src', obj.IMG_NAME() );
    },
    connect: function ( id )
    {
        var fixId = $('.fixPoint[data-id="' + id + '"]'),
            nomeId = $('.namePoint[data-id="' + id + '"]');

        Fugitivas.conectionInstance.connect({
            source: fixId,
            target: nomeId,
            scope: "link_" + id,
            anchor: "AutoDefault",
            paintStyle: Fugitivas.paintStyle
        });

        nomeId.on('dragstop', function () {
            var that = $(this);
            var $viewport = $('#viewport');
            var sizeFont = 7;
            var totalFont = that.text().length < 10 ? 11 : that.text().length;
            var button = that.find('.editar').is(':visible') ? 45 : 20;

            var objTag = {
                id: that.attr("data-id"),
                topPosition: that.css('top'),
                leftPosition: that.css('left')
            };

            var size = {
                height: parseInt( that.css('height') ) + 2,
                width: (totalFont * sizeFont) + button
            };

            var viewport = {
                width: parseInt( $viewport.width() ),
                height: parseInt( $viewport.height() )
            };

            function repintar() {
                setTimeout(function () {
                    var objPosi = {
                        left: parseInt( objTag.leftPosition ),
                        top: parseInt( objTag.topPosition )
                    };
                    Fugitivas.conectionInstance.repaint(that, objPosi);
                }, 40);
            }

            if (parseInt(objTag.leftPosition) < 0) {
                $(this).css('left', '0px');
                objTag.leftPosition = "0px";
                repintar();
            }

            if (parseInt(objTag.leftPosition) > viewport.width) {
                var calcWidth = (viewport.width - size.width) + "px";
                $(this).css('left', calcWidth);
                objTag.leftPosition = calcWidth;
                repintar();
            }

            if (parseInt(objTag.topPosition) < 0) {
                $(this).css('top', '0px');
                objTag.topPosition = "0px";
                repintar();
            }

            if (parseInt(objTag.topPosition) > viewport.height) {
                var calcHeight = (viewport.height - size.height) + "px";
                $(this).css('top', calcHeight);
                objTag.topPosition = calcHeight;
                repintar();
            }

            Fugitivas.Methods.salvarPosicaoTag(objTag);

        });

    },
    salvarPosicaoTag: function ( obj )
    {
        var editPonto = ko.utils.arrayFirst(Fugitivas.ModelFugitivas.dadosModal().PONTO_MEDICAO(), function (item) {
            return obj.id == item.ID();
        });
        if (Fugitivas.URLS.AtualizarPosicaoTag) {
            Fugitivas.Methods.postData(Fugitivas.URLS.AtualizarPosicaoTag + Fugitivas.ModelFugitivas.dadosModal().ID, obj, function (result) {
                if (result.type) {
                    editPonto.POSICAO_TAG.TOP( obj.topPosition );
                    editPonto.POSICAO_TAG.LEFT( obj.leftPosition );
                }
                Fugitivas.Notifica(result.type, result.mensagem);
            });
        } else {
            editPonto.POSICAO_TAG.TOP( obj.topPosition );
            editPonto.POSICAO_TAG.LEFT( obj.leftPosition );
            Fugitivas.Notifica(true, "Posição atualizada com sucesso!");
        }
    }
};
