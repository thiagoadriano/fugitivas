module.exports = function(grunt){
	
	grunt.initConfig({
		options:{ separator: ';' },
		concat:{
			build:{
				files:{
					'public/assets/js/libs/jquery.js' : [
							'dev/js/lib/jquery/jquery-2.1.4.js',
							'dev/js/lib/jquery/jquery-ui.js', 
							'dev/js/lib/jquery/jquery.tmpl.min.js',
							'dev/js/lib/jquery/jquery.ui.touch-punch-0.2.2.min.js'
						],
						
					'public/assets/js/libs/recursos.js': [
							'dev/js/lib/recurso/bootstrap.js',	
							'dev/js/lib/recurso/bootstrap-filestyle.js',
							'dev/js/lib/recurso/jquery.form.js'
						],
						
					'public/assets/js/libs/imgnote.js' :[
							'dev/js/lib/imgnote/jquery.fs.zoetrope.js', 
							'dev/js/lib/imgnote/jquery.mousewheel.js', 
							'dev/js/lib/imgnote/toe.js', 
							'dev/js/lib/imgnote/imgViewer.js', 
							'dev/js/lib/imgnote/imgNotes.js'
						],
						
					'public/assets/js/libs/jsplumb.js': [
							'dev/js/lib/jsplumb/jsBezier-0.7.js',
							'dev/js/lib/jsplumb/mottle-0.6.js',
							'dev/js/lib/jsplumb/biltong-0.2.js',
							'dev/js/lib/jsplumb/katavorio-0.6.js',
							'dev/js/lib/jsplumb/util.js',
							'dev/js/lib/jsplumb/browser-util.js',
							'dev/js/lib/jsplumb/jsPlumb.js',
							'dev/js/lib/jsplumb/dom-adapter.js',
							'dev/js/lib/jsplumb/overlay-component.js',
							'dev/js/lib/jsplumb/endpoint.js',
							'dev/js/lib/jsplumb/connection.js',
							'dev/js/lib/jsplumb/anchors.js',
							'dev/js/lib/jsplumb/defaults.js',
							'dev/js/lib/jsplumb/connectors-bezier.js',
							'dev/js/lib/jsplumb/connectors-statemachine.js',
							'dev/js/lib/jsplumb/connectors-flowchart.js',
							'dev/js/lib/jsplumb/connector-editors.js',
							'dev/js/lib/jsplumb/renderers-svg.js',
							'dev/js/lib/jsplumb/renderers-vml.js',
							'dev/js/lib/jsplumb/base-library-adapter.js',
							'dev/js/lib/jsplumb/dom.jsPlumb.js',
							'dev/js/lib/jsplumb/jquery.jsPlumb.js'
						],
					
					'public/assets/js/libs/knockout.js': [
							'dev/js/lib/knockout/knockout-3.3.0.js', 
							'dev/js/lib/knockout/knockout.mapping.js'
						],
					
					'public/assets/js/fugitivas.js': [
							'dev/js/fugitivas/default.js',
							'dev/js/fugitivas/controller.js',
							'dev/js/fugitivas/model.js',
							'dev/js/fugitivas/component.js',
							'dev/js/fugitivas/eventos.js'
						]
					
				} 
			}
		},//close concat
		
		cssmin: {
		  options: {
		    shorthandCompacting: false,
		    roundingPrecision: -1,
			expand: false,
		  },
		  target: {
		    files: {
		      'public/assets/css/libs.css': [
				  'dev/css/jquery-ui.css', 
				  'dev/css/jquery-ui.structure.css',
				  'dev/css/jquery-ui.theme.css',
				  'dev/css/marker.css',
				  'dev/css/bootstrap.css',
				  'dev/css/jsplumb.css'
				]
		    }
		  }
		}// close cssmin
		
	});
	
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	grunt.registerTask('build', ['concat', 'cssmin']);
};