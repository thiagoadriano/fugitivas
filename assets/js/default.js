var Fugitivas = Fugitivas || {};

Fugitivas.CONTAINER_IMAGEM = "#MainContentIMG";

Fugitivas.URLS = {};
Fugitivas.URLS.Base          = "/json_dados/";
Fugitivas.URLS.Especialidade = Fugitivas.URLS.Base + "_especialidade.json";
Fugitivas.URLS.Componente    = Fugitivas.URLS.Base + "_componente.json";
Fugitivas.URLS.ListaGrupo    = Fugitivas.URLS.Base + "_lista_de_grupo.json";
Fugitivas.URLS.Fabricante    = Fugitivas.URLS.Base + "_fabricantes.json";



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
        $( '#NoteDialog' ).remove();
        Fugitivas.ModelFugitivas.flagNovoPonto( true );

        return $( '<div id="NoteDialog"></div>' ).dialog( {
            title: ( Fugitivas.ModelFugitivas.flagNovoPonto() === true ) ? "Adicionar Ponto" : "Editar Ponto",
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
        } );
    },
    onShow: function ()
    {

    }

};