'use strict';

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
      files: ['Gruntfile.js', 'server.js', 'database.js', 'server/**/*.js'],
      options: {force: 'true', jshintrc: true}
    },

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js', 'server.js', 'database.js', 'server/**/*.js'],
        tasks: ['jshint', 'test']
      },
    },
  });

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('default', ['concurrent']);
};
