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
    setPointCustom: function ( nameId, id, fixX, fixY, tag )
    {
        var idBaseName = nameId.replace( /\W/g, "" );
        var idFix = "fix-" + idBaseName;
        var idBase = "base-" + idBaseName;
        var idLabel = "label-" + idBaseName;
        var template = '<div class="basePoint" id="' + idBase + '">' +
                           '<div class="fixPoint" id="' + idFix + '"></div>' +
                           '<div class="namePoint"  data-id="' + id + '" id="' + idLabel + '">' +
                               '<span>' + nameId + '</span>' +
                               '<button class="visualizar"><span class="glyphicon glyphicon-eye-open"></span></button>' +
                               '<button class="editar"><span class="glyphicon glyphicon-edit"></span></button>' +
                            '</div>' +
                       '</div>';
        
        tag.attr( "id", idFix );
        tag.append( template );
        $( ".fixPoint" ).last().css( { top: parseFloat( fixY ) + "px", left: parseFloat( fixY ) + "px" } );

        Fugitivas.Methods.createLine( {} )
        


    },
    getItemId: function ( list, id )
    {
        return ko.utils.arrayFirst( list, function ( item )
        {
            return parseInt( id ) == item.ID();
        } ) || "Not Found";
    },
    callbackCadastro: function ( tpl, tag )
    {
        $( "#NoteDialog" ).dialog( "close" );

        var left = tag.css( "left" );
        var top = tag.css( "top" );
        var id = tag.attr( "data-id" );

        Fugitivas.Methods.setPointCustom( tpl, id, left, top, tag );
    },
    getLastID: function ()
    {
        var dados = Fugitivas.ModelFugitivas.dadosModal(),
                pontos = dados.MARCACAO_PONTO;
        var lastId = ( pontos.length ? parseInt( pontos[pontos.length - 1].ID ) + 1 : 0 );
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
    createLine: function ( obj )
    {
        jsPlumb.ready( function ()
        {

        } );

    }

};