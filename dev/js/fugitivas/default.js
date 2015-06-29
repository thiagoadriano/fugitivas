var Fugitivas = Fugitivas || {};

'use strict';
//ID DO CONTAINER DE IMAGEM PARA USO DO COMPONENTE
Fugitivas.CONTAINER_IMAGEM = "#MainContentIMG";

//ISNTANCIA DE CONEXÂO
Fugitivas.conectionInstance = null;

//URLS PARA USO DO SISTEMA
Fugitivas.URLS = {};
Fugitivas.URLS.Base          = "/json_dados/";
Fugitivas.URLS.Especialidade = Fugitivas.URLS.Base + "_especialidade.json";
Fugitivas.URLS.Componente    = Fugitivas.URLS.Base + "_componente.json";
Fugitivas.URLS.ListaGrupo    = Fugitivas.URLS.Base + "_lista_de_grupo.json";
Fugitivas.URLS.Fabricante    = Fugitivas.URLS.Base + "_fabricantes.json";
Fugitivas.URLS.PosicaoPonto  = Fugitivas.URLS.Base + "_posicao_do_ponto.json";
Fugitivas.URLS.Deletar       = undefined;
Fugitivas.URLS.Salvar        = undefined;
Fugitivas.URLS.Atualizar     = undefined;
Fugitivas.URLS.AtualizarPosicaoTag = undefined;


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
    },
    onUpdateMarker: function (elem)
    {
        var $elem = $(elem);
        var $img = $(this.img);
        var pos = $img.imgViewer("imgToView", $elem.data("relx"), $elem.data("rely"));
        var zoom = $img.imgViewer("option", "zoom");
        if (pos) {
            $elem.css({
                left: (pos.x - $elem.data("xOffset")),
                top: (pos.y - $elem.data("yOffset")),
                position: "absolute"
            });
            if (Fugitivas.conectionInstance !== null) {
                Fugitivas.conectionInstance.repaintEverything();
            }

        }
    }
};

//CONFIGURAÇÂO PARA O ENCADEAMENTO
Fugitivas.defaultJSPlumb = {
    PaintStyle: {
        lineWidth: 2.5,
        strokeStyle: "white",
        outlineColor: "",
        outlineWidth: 0
    },
    ConnectionsDetachable: false,
    DoNotThrowErrors: true,
    Connector: ["Bezier", { curviness: 80 }],
    Endpoints: [["Dot", { radius: 1 }], ["Dot", { radius: 2 }]],
    MaxConnections: 10,
    ReattachConnections: true,
    Anchors: ["Bottom", "TopRight"],
    DragOptions: { cursor: "move", zIndex: 2000 },
    isSource: true,
    isTarget: true,
    Container: "viewport"
};

//CONFIGURAÇÂO DAS LINHAS DE LIGAÇÂO
Fugitivas.paintStyle = {
    strokeStyle: "#FFFFFF",
    lineWidth: 2,
    outlineColor: "#A8A8A8",
    outlineWidth: 0.5
}

//ELEMENTOS DO MODAL
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
    FLUXOGRAMA: $('#FLUXOGRAMA'),
    SITUACAO:$('#SITUACAO'),
    NOTA: $( '#NOTA' ),
    IMAGEM: $(Fugitivas.CONTAINER_IMAGEM),
    zoomOut: $( '#zoomOut' ),
    editClick: $( '#editClick' ),
    FecharModal: $( '#FecharModal' ),
    openModal: $('#grupo')
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

document.onselectstart = function(){
    return false;
};
