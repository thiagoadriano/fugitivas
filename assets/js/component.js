var Fugitivas = Fugitivas || {};

'use strict';
ko.components.register( 'form-content', {
    viewModel: function (params) {
        var self = this;
        self.listType = params.tipos;
        self.listManufacturers = params.fabricantes;
        self.listSpecialty = params.especialidade;
        self.listSubtype = ko.observableArray([{ NOME: "Selecione um Tipo com Subtipo", ID: "" }]);
        self.typeSelect = ko.observable();
        self.subTypeSelect = ko.observable();
        self.manufactSelect = ko.observable();
        self.dimmerSelect = ko.observable();
        self.dimmerComboSelect = ko.observable();
        self.positionSelect = ko.observable();
        self.specialtySelect = ko.observable();
        //self.novoPonto = params.flag;

        ko.bindingHandlers.numeric = {
            init: function ( element, valueAcessor )
            {
                function remove(el)
                {
                    var value = el.val().toString();
                    value = value.replace( /\D/, "" );
                    return value;
                }
                $( element ).on( {
                    keypress: function ( event )
                    {
                        $( this ).val( remove( $(this) ) );

                    },
                    keyup: function ( event )
                    {
                        $( this ).val( remove( $( this ) ) );

                    },
                    blur: function ( event )
                    {
                        $( this ).val( remove( $( this ) ) );

                    }
                });

                
            }
        };

        self.typeSelect.subscribe(
            function (data) {
                self.listSubtype([]);
                var objetoComponente = self.listType()[data];

                if (objetoComponente !== undefined && objetoComponente.SUBTIPO().length) {
                    for (var i in objetoComponente.SUBTIPO()) {
                        self.listSubtype.push(objetoComponente.SUBTIPO()[i]);
                    };
                }
                else {
                    self.listSubtype.push({ NOME: "Selecione um Tipo com Subtipo", ID: "" });
                }

            }
        );

        self.savePoint = function (data) {
            try {
                if ( Fugitivas.Methods.validarCampos() )
                {

                    var dados = Fugitivas.ModelFugitivas.dadosModal(),
                        pontos = dados.MARCACAO_PONTO;
                    var novaId = ( pontos.length ? parseInt( pontos[pontos.length - 1].ID ) + 1 : 0 );
                    var dadosPontoImagem = $( Fugitivas.CONTAINER_IMAGEM ).imgNotes( "export" );
                    var ultimoPonto = dadosPontoImagem[dadosPontoImagem.length - 1];
                    var ultimoPontoTag = $( ".markerPoint" ).last();
                    var Componente = Fugitivas.Methods.getItemId( self.listType(), data.typeSelect() );
                    var subComponente = data.subTypeSelect() !== "" ? Fugitivas.Methods.getItemId( Componente.SUBTIPO(), data.subTypeSelect() ) : "";
                    var templateTag = Componente.SIGLA() + ( subComponente ? " - " + subComponente.SIGLA() : "" ) + " - " + Math.floor( Math.random() * 1000 );
                    ultimoPontoTag.removeClass( "pointInitial" );

                    pontos.push( {
                        ID: novaId,
                        COORDS: { X: ultimoPonto.x, Y: ultimoPonto.y },
                        DADOS_PONTO: {
                            TIPO_COMPONENTE: data.typeSelect(),
                            SUBTIPO_COMPONENTE: data.subTypeSelect(),
                            FABRICANTE: data.manufactSelect(),
                            DIMENSAO: data.dimmerSelect(),
                            MEDIDA_DIMENSAO: data.dimmerComboSelect(),
                            POSICAO_PONTO: data.positionSelect(),
                            ESPECIALIDADE_PONTO: data.specialtySelect()
                        }
                    } );

                    
                    //$.post("URLDOSERVER", JSON.stringify(ModelFugitivas.dadosModal()), callbackAPOSCADASTRO, "JSON");

                    Fugitivas.Methods.callbackCadastro(templateTag, ultimoPontoTag)

                    
                }

            } catch (e) {
                if (console.table) {
                    console.table(e);
                }
                console.error(e)
            }


        };

        self.close = function () {
            if (self.novoPonto) {
                var div = $( ".markerPoint" )[$( ".markerPoint" ).length - 1];
                $(div).trigger("remove");
                $("#NoteDialog").dialog("close");
            } else {
                $("#NoteDialog").dialog("close");
            }
        };

        self.deleted = function ( data, element )
        {
            console.log( data );
            console.log( "\n" );
            console.log( element )
        };

    },
    template: '<form id="fromDados" class="form-horizontal"><div role="tabpanel"><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#componente" aria-controls="componente" role="tab" data-toggle="tab">Componente</a></li><li role="presentation"><a href="#caracteristicas" aria-controls="caracteristicas" role="tab" data-toggle="tab">Características</a></li></ul></div><div class="tab-content"><div role="tabpanel" class="tab-pane fade in active" id="componente"><div class="form-group"><label class="col-md-4 control-label" for="tipo">* Tipo: </label><div class="col-md-8"><select id="tipo" class="form-control input-sm" data-bind="options: listType, optionsText: \'COMPONENTE\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value: typeSelect"></select></div></div><div class="form-group"><label class="col-md-4 control-label" for="subtipo">* Subtipo: </label><div class="col-md-8"><select id="subtipo" class="form-control input-sm" data-bind="options: listSubtype, enable: subTypeSelect() != \'\' && subTypeSelect() != undefined , optionsText: \'NOME\', optionsValue: \'ID\', value: subTypeSelect"></select></div></div><div class="form-group"><label class="col-md-4 control-label" for="fabricante">* Fabricante: </label><div class="col-md-8"><select id="fabricante" class="form-control input-sm" data-bind="options: listManufacturers, optionsText: \'RAZAO_SOCIAL\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value: manufactSelect"></select></div></div></div><div role="tabpanel" class="tab-pane fade" id="caracteristicas"><div class="form-group"><label class="col-md-5 control-label" for="dimensao">* Dimensão do componente: </label><div class="col-md-3"><input type="text" id="dimensao" class="form-control input-sm" data-bind="value: dimmerSelect, numeric: dimmerSelect"></div><div class="col-md-4"><select id="dimensao_medida" class="form-control input-sm" data-bind="value: dimmerComboSelect"><option value="0">Polegadas</option><option value="1">Milímetros</option></select></div></div><div class="form-group"><label class="col-md-5 control-label" for="posicao">* Posição do ponto: </label><div class="col-md-7"><input type="text" id="posicao" data-bind="value: positionSelect"class="form-control input-sm"></div></div><div class="form-group"><label class="col-md-5 control-label" for="especialidade">* Especialidade do ponto: </label><div class="col-md-7"><select id="especialidade" class="form-control input-sm" data-bind="options: listSpecialty, optionsText: \'ESPECIALIDADE\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value:specialtySelect"></select></div></div></div><div class="row"><div class="col-md-3 col-md-offset-2"><button type="submit" class="btn btn-success btn-block" data-bind="click: savePoint">Salvar</button></div><div class="col-md-3"><button type="button" class="btn btn-danger btn-block" data-bind="click: deleted">Deletar</button></div><div class="col-md-3"><button type="button" class="btn btn-default btn-block" data-bind="click: close">Fechar</button></div></div></div></form>'
});