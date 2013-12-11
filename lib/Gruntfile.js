module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				banner: 'DEBUG = true;',
			},
			dist: {
				src: ['src/vendor.js', 'src/adapter.js', 'src/<%= pkg.name %>.js'],
				dest: '<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				compress: {
					global_defs: {
						'DEBUG': false
					},
					dead_code: true,
					drop_debugger: true,
					properties: true
				},
				sourceMap: '<%= pkg.name %>.map.js'
			},
			dist: {
				files: {
					'<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'uglify']);

};