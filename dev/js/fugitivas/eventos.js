'use strict';
$(function ()
{
    $( '#containerLoading' ).css( 'height', $( window ).height() );
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
        $('#modalPontos').modal("hide");
        if ($(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit")) {
            $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit", false);
        }
        Fugitivas.ElModal.IMAGEM.attr('src', '');
        $(Fugitivas.CONTAINER_IMAGEM).imgNotes('destroy');
        Fugitivas.ElModal.editClick.text("Editar");
        Fugitivas.conectionInstance = null;
        
        
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
    } );

    Fugitivas.ElModal.editClick.on( 'click', function ()
    {
        if ( $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "canEdit" ) )
        {
            $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit", false);
            $(this).text("Editar");
            $('.editar').hide();
            $( '.namePoint' ).removeClass('cursorMove').draggable( "destroy" );
        } else
        {
            $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "canEdit", true );
            $(this).text("Concluir");
            $('.editar').show();
            Fugitivas.conectionInstance.draggable( $( '.namePoint' ).addClass('cursorMove') );
        }
    } );

    Fugitivas.ElModal.zoomOut.on( 'click', function ()
    {
        $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "zoom", 1);
        Fugitivas.conectionInstance.repaintEverything();
    });

});
