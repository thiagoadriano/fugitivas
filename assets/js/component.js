var Methods = {
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
    setPointCustom: function ( nameId, element, fixX, fixY )
    {
        var template = '<div class="basePoint">' +
                            '<div class="fixPOint"></div>' +
                            '<div class="lineToFix"></div>' +
                            '<div class="joinPoint"></div>"' +
                             '<div class="lineToDrop"></div>' +
                            '<div class="namePoint"><span>' + nameId + '</span></div>'+
                        '</div>';
        element.html( template );
        $( ".fixPOint" ).last().css( { top: Math.round( fixY ) + "px", left: Math.round( fixY ) + "px" } );

        $( ".namePoint, .joinPoint" ).draggable();

    },
    getItemId: function ( list,id )
    {
        return ko.utils.arrayFirst( list, function (item)
        {
            return parseInt(id) == item.ID();
        } ) || "Not Found";
    }
};

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
        self.novoPonto = params.flag;

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
                if ( Methods.validarCampos() )
                {

                    var dados = ModelFugitivas.dadosModal(),
                        pontos = dados.MARCACAO_PONTO;
                    var novaId = ( pontos.length ? parseInt( pontos[pontos.length - 1].ID ) + 1 : 0 );
                    var dadosPontoImagem = $( CONTAINER_IMAGEM ).imgNotes( "export" );
                    var ultimoPonto = dadosPontoImagem[dadosPontoImagem.length - 1];
                    var ultimoPontoTag = $( ".markerPoint" ).last();
                    var Componente = Methods.getItemId( self.listType(), data.typeSelect() );
                    var subComponente = data.subTypeSelect() !== "" ? Methods.getItemId( Componente.SUBTIPO(), data.subTypeSelect() ) : "";
                    var templateTag = Componente.SIGLA() + (subComponente ? " - " + subComponente.SIGLA() : "") + " - " + Math.floor(Math.random() * 1000);

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

                    
                    //$.post("URLDOSERVER", JSON.stringify(ModelFugitivas.dadosModal()), callbackAPÒSCADASTRO, "JSON");

                    $( "#NoteDialog" ).dialog( "close" );

                    var left = ultimoPontoTag.css( "left" );
                    var top = ultimoPontoTag.css( "top" );

                    ultimoPontoTag.removeClass( "pointInitial" );
                    Methods.setPointCustom( templateTag, ultimoPontoTag, left, top );

                    
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

    },
    template: '<form id="fromDados" class="form-horizontal"><div role="tabpanel"><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#componente" aria-controls="componente" role="tab" data-toggle="tab">Componente</a></li><li role="presentation"><a href="#caracteristicas" aria-controls="caracteristicas" role="tab" data-toggle="tab">Características</a></li></ul></div><div class="tab-content"><div role="tabpanel" class="tab-pane fade in active" id="componente"><div class="form-group"><label class="col-md-4 control-label" for="tipo">* Tipo: </label><div class="col-md-8"><select id="tipo" class="form-control input-sm" data-bind="options: listType, optionsText: \'COMPONENTE\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value: typeSelect"></select></div></div><div class="form-group"><label class="col-md-4 control-label" for="subtipo">* Subtipo: </label><div class="col-md-8"><select id="subtipo" class="form-control input-sm" data-bind="options: listSubtype, enable: subTypeSelect() != \'\' && subTypeSelect() != undefined , optionsText: \'NOME\', optionsValue: \'ID\', value: subTypeSelect"></select></div></div><div class="form-group"><label class="col-md-4 control-label" for="fabricante">* Fabricante: </label><div class="col-md-8"><select id="fabricante" class="form-control input-sm" data-bind="options: listManufacturers, optionsText: \'RAZAO_SOCIAL\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value: manufactSelect"></select></div></div></div><div role="tabpanel" class="tab-pane fade" id="caracteristicas"><div class="form-group"><label class="col-md-5 control-label" for="dimensao">* Dimensão do componente: </label><div class="col-md-3"><input type="text" id="dimensao" class="form-control input-sm" data-bind="value: dimmerSelect, numeric: dimmerSelect"></div><div class="col-md-4"><select id="dimensao_medida" class="form-control input-sm" data-bind="value: dimmerComboSelect"><option value="0">Polegadas</option><option value="1">Milímetros</option></select></div></div><div class="form-group"><label class="col-md-5 control-label" for="posicao">* Posição do ponto: </label><div class="col-md-7"><input type="text" id="posicao" data-bind="value: positionSelect"class="form-control input-sm"></div></div><div class="form-group"><label class="col-md-5 control-label" for="especialidade">* Especialidade do ponto: </label><div class="col-md-7"><select id="especialidade" class="form-control input-sm" data-bind="options: listSpecialty, optionsText: \'ESPECIALIDADE\', optionsValue: \'ID\', optionsCaption: \'Selecione\', value:specialtySelect"></select></div></div></div><div class="row"><div class="col-md-5 col-md-offset-1"><button type="submit" class="btn btn-success btn-block" data-bind="click: savePoint">Salvar</button></div><div class="col-md-5"><button type="button" class="btn btn-default btn-block" data-bind="click: close">Fechar</button></div></div></div></form>'
});