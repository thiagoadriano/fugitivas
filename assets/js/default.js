var CONTAINER_IMAGEM = "#MainContentIMG";
var URLS = {};
URLS.Base = "/json_dados/";
URLS.Especialidade = URLS.Base + "_especialidade.json";
URLS.Componente = URLS.Base + "_componente.json";
URLS.ListaGrupo = URLS.Base + "_lista_de_grupo.json";
URLS.Fabricante = URLS.Base + "_fabricantes.json";
URLS.IncludeForm = "_form.inc.html";

function getData( urlLink, callback )
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


};

function getLastID()
{
    var dados = ModelFugitivas.dadosModal(),
                pontos = dados.MARCACAO_PONTO;
    var lastId = ( pontos.length ? parseInt( pontos[pontos.length - 1].ID ) + 1: 0 );
    return lastId;

}

var defaultImgNotes = {
    onAdd: function ()
    {
        this.options.vAll = "bottom";
        this.options.hAll = "middle";
        var elem = $( document.createElement( 'div' ) ).addClass( "markerPoint pointInitial" ).attr( "data-id", getLastID() );
        return elem;
    },
    onEdit: function ( ev, elem )
    {
        var $elem = $( elem );
        $( CONTAINER_IMAGEM ).imgNotes()
        $elem.attr( "data-bind", "" )
        $( '#NoteDialog' ).remove();
        ModelFugitivas.flagNovoPonto( true );
        return $( '<div id="NoteDialog"></div>' ).dialog( {
            title: ( ModelFugitivas.flagNovoPonto() === true ) ? "Adicionar Ponto" : "Editar Ponto",
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
                $( this ).attr( "data-bind", "component: {name: 'form-content', params:{tipos: listagemComponente, fabricantes: listagemFabricante, especialidade: listagemEspecialidade, flag: flagNovoPonto}}" );
                ko.applyBindings( ModelFugitivas, $( "#NoteDialog" )[0] );
            }
        } );
    }

};