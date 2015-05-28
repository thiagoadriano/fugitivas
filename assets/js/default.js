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
        Fugitivas.ModelFugitivas.flagSatatusPonto( "new" );
        return Fugitivas.Methods.dialogOpen( "Adicionar Ponto", elem);
    }
};
