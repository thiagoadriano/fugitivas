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
        var elem = $( document.createElement( 'div' ) ).addClass( "markerPoint pointInitial" ).attr( "data-id", Fugitivas.Methods.getLastID() );
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


//LOADING REQUEST AJAX
$( function ()
{
    $.ajaxSetup( {
        beforeSend: function ()
        {
            var tplLodoading = '<div id="containerLoading" style="display:none;">' +
                                '<div id="loading">' +
                                    '<img src="assets/img/preloader.gif">' +
                                    '<p>Aguarde os dados estão sendo carregados...</p>' +
                               '</div>' +
                           '</div>';

            if ( $( '#containerLoading' ).length )
            {
                $( '#containerLoading' ).html( "" ).remove();
            }

            $( '#containerLoading' ).css( 'height', $( 'body' ).height() )
            $( 'body' ).append( tplLodoading );

            $( '#containerLoading' ).fadeIn( 'slow' );

        },
        complete: function ()
        {
            $( '#containerLoading' ).fadeOut( 'slow', function ()
            {
                $( this ).html( "" ).remove();
            } );

        }
    } );
} );