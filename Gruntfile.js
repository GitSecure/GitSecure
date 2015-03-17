module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/**/*.js']
      }
    },

    clean: {
      dist: 'dist/*',
      result: 'results/*'
    },

    copy: {
      client: {

      },
      server: {
        src: ['basic-server.js'],
        dest: 'dist/'
      },
      services: {
        src: ['services/**'],
        dest: 'dist/'
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'basic-server.ks',
        'services/parsing/*.js',
        'Test/unit/parsing.js'
      ],
      options: {
        force: 'true',
      }
    },

    express: {
      dev: {
        options: {
          script: 'dist/basic-server.js'
        }
      }
    },

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      client: {
      },
      server: {
        files: ['server/**'],
        tasks: ['build', 'express:dev'],
        options: {
          spawn: false
        }
      },
      services: {
        files: ['services/**'],
        tasks: [ 'build','express:dev'],
      },
      unitTests: {
        files: ['Test/unit/parsing.js']
      },
      integrationTests: {

      },
      e2eTests: {

      }
    },
  });

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('build', ['jshint', 'clean', 'copy']);
};
