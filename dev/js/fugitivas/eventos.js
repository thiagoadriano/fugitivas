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
        conectionInstance = null;
        
        
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
            $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "canEdit", false);
            $(this).text("Editar");
            $('.editar').hide();
            $( '.namePoint' ).draggable( "destroy" );
        } else
        {
            $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "option", "canEdit", true );
            $(this).text("Concluir");
            $('.editar').show();
            Fugitivas.conectionInstance.draggable( $( '.namePoint' ) );
        }
    } );

    Fugitivas.ElModal.zoomOut.on( 'click', function ()
    {
        $(Fugitivas.CONTAINER_IMAGEM).imgNotes("option", "zoom", 1);
        Fugitivas.conectionInstance.repaintEverything();
    });

    Fugitivas.ElModal.btnAddCadastro.on('click', function () {
        Fugitivas.Methods.bloquearInputCadastro(false);
        $('#modalIncludGroup').modal('show');
    });

    Fugitivas.ElModal.btnCancelAdd.on( 'click', function ()
    {
        Fugitivas.ModelFugitivas.idEditGroup( "" );
        Fugitivas.ModelFugitivas.idViewGroup( "" );
        $( '#modalIncludGroup' ).modal( 'hide' );
        Fugitivas.Methods.limparModalCadastro();
    });

    Fugitivas.ElModal.btnCadastro.on('click', function () {
        var ids = ['#nomeGrupo_cad', '#empresa_cad', '#nivel1_cad', '#nivel2_cad', '#nivel3_cad', '#unidadeProcesso_cad', '#linhaProcesso_cad', '#tagEquipamento_cad', '#posicaoGrupo_cad', '#fluxograma_cad', '#situacao_cad', '#nota_cad'];

        if ( Fugitivas.Methods.isValideFormCadastro(ids) )
        {
            var Grupo = Fugitivas.ModelFugitivas.listaGrupoPontos();
            var _idGrupoPonto = parseInt( Grupo[Grupo.length - 1].ID_GRUPO_PONTO() ) + 1;
            var _idGrupo = parseInt( Grupo[Grupo.length - 1].ID() ) + 1;

            var GrupoRetornado = {
                NomeGrupo:       Fugitivas.ElModal.nomeGrupo.val(),
                Empresa:         Fugitivas.ElModal.empresa.val(),
                Nivel1:          Fugitivas.ElModal.nivel1.val(),
                Nivel2:          Fugitivas.ElModal.nivel2.val(),
                Nivel3:          Fugitivas.ElModal.nivel3.val(),
                UnidadeProcesso: Fugitivas.ElModal.unidadeProcesso.val(),
                LinhaProcesso:   Fugitivas.ElModal.linhaProcesso.val(),
                TagEquipamento:  Fugitivas.ElModal.tagEquipamento.val(),
                PosicaoGrupo:    Fugitivas.ElModal.posicaoGrupo.val(),
                Fluxograma:      Fugitivas.ElModal.fluxograma.val(),
                Situacao:        Fugitivas.ElModal.situacao.val(),
                upload:          Fugitivas.ElModal.upload.val(),
                Nota:            Fugitivas.ElModal.nota.val()
            };
       

            var GrupoLista = {
                ID: _idGrupo,
                NOME_GRUPO_PONTOS: GrupoRetornado.NomeGrupo,
                UNIDADE_PROCESSO: GrupoRetornado.UnidadeProcesso,
                LINHA_PROCESSO: GrupoRetornado.LinhaProcesso,
                TAG_EQUIPAMENTO: GrupoRetornado.TagEquipamento,
                EXISTE_IMAGEM: GrupoRetornado.upload.length ? true : false,
                ID_GRUPO_PONTO: _idGrupoPonto
            };

            if ( Fugitivas.URLS.SalvarGrupo )
            {
                var options = {
                    url: Fugitivas.URLS.SalvarGrupo,
                    success: function (result)
                    {
                        if ( result.type )
                        {
                            Fugitivas.ModelFugitivas.listaGrupoPontos.push( ko.mapping.fromJS( GrupoLista ) );
                            Fugitivas.ElModal.btnCancelAdd.trigger( 'click' );
                            Fugitivas.Methods.limparModalCadastro();
                        }
                        Fugitivas.Notifica( result.type, result.mensagem );
                    
                    }
                };
                $( '#formCadastro' ).ajaxForm( options );
            } else
            {
                Fugitivas.ModelFugitivas.listaGrupoPontos.push( ko.mapping.fromJS( GrupoLista ) );
                Fugitivas.Notifica( true, "Grupo Cadastrado com Sucesso!" );
                Fugitivas.ElModal.btnCancelAdd.trigger( 'click' );
                Fugitivas.Methods.limparModalCadastro();
            }
        }

    } );

    Fugitivas.ElModal.upload.filestyle();

});
