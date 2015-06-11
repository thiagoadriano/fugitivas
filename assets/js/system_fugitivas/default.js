﻿var Fugitivas = Fugitivas || {};

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