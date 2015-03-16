module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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

    karma: {
      options: {
        configFile: 'karma.conf.js',
        reporters: ['progress', 'coverage']
      },
      watch: {
        background: true,
        reporters: ['progress']
      },
      single: {
        singleRun: true,
      },
      ci: {
        singleRun: true,
        coverageReporter: {
          type: 'lcov',
          dir: 'results/coverage/'
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
        tasks: [ 'build','express:dev', 'karma:watch:run'],
      },
      unitTests: {
        files: ['Test/unit/parsing.js'],
        tasks: ['karma:watch:run']
      },
      integrationTests: {

      },
      e2eTests: {

      }
    }
  });
  
  grunt.registerTask('build', ['jshint', 'clean', 'copy']);

  // grunt.registerTask('testClient', ['karma:single']);

  grunt.registerTask('testServer', ['karma:single']);

  grunt.registerTas('test', ['testServer']); //will have e2e testing later and client test later

  // grunt.registerTask('ci', ['karma:ci', 'express:dev']);

  grunt.registerTask('default', ['build', 'express:dev', 'karma:watch:start', 'watch']);

};