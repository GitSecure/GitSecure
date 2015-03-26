'use strict';
var touch = require('touch');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

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

    jshint: {
      files: [
        'Gruntfile.js',
        'server.js',
        'database.js',
        'gitListner/**/*.js',
        'server/**/*.js'
      ],
      options: {force: 'true', jshintrc: true}
    },

    concurrent: {
      main: {
        tasks: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      gitHook: {
        tasks: ['nodemon:git'],
        options: {
          logConcurrentOutput: true
        }
      },
      all: {
        tasks: ['nodemon:git', 'nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true,
          limit: 3
        }
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          callback: function (nodemon) {
            nodemon.on('crash', function () {
              console.error('App Crash');
              touch('server.js');
            });
          }
        }
      },
      git: {
        script: 'gitListener/gitHookServer.js',
        options: {
          callback: function (nodemon) {
            nodemon.on('crash', function () {
              console.error('App Crash');
              touch('gitListener/gitHookServer.js');
            });
          }
        }
      }
    },

    watch: {
      gruntfile: {
        files: [
          'Gruntfile.js',
          'server.js',
          'database.js',
          'gitListner/**/*.js',
          'server/**/*.js'
        ],
        tasks: ['jshint', 'test']
      },
    },
  });

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('default', ['concurrent:main']);
  grunt.registerTask('withGit', ['concurrent:all']);
};
