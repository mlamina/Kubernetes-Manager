module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngconstant: {
      options: {
        name: 'k8s-manager.constants',
        dest: 'app/components/constants.js'
      },
      development: {
        constants: {
          useDataMocks: true
        }
      },
      production: {
        constants: {
          useDataMocks: false
        }
      }
    },
    clean: {
      build: ['build']
    },
    exec: {
      build_docker_image: 'docker build -t mlamina/k8s-manager .',
      push_docker_image: 'docker push mlamina/k8s-manager '
    },
    copy: {
      all : {
        files: [
          { expand: true,
            cwd: 'app',
            src: [
              'assets/**',
              'bower_components/**',
              'components/**',
              'app.*', 'index.html'
            ],
            dest: 'build'
          }
        ]
      }
    },
    connect: {
      development: {
        options: {
          hostname: 'localhost',
          port: 8000,
          base: 'app',
          open: true,
          livereload: true
        }
      }
    },
    watch: {
      sources: {
        files: [
          'app/**/*.js',
          'app/**/*.html',
          'app/**/*.css',
          'app/**/*.json'
        ],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', [
    'ngconstant:production',
    'copy:all',
    'ngconstant:development'
  ]);

  grunt.registerTask('clean', [
    'clean:build'
  ]);

  grunt.registerTask('push', [
    'build',
    'exec:build_docker_image',
    'exec:push_docker_image'
  ]);

  grunt.registerTask('start', [
    'connect:development',
    'watch:sources'
  ]);

};