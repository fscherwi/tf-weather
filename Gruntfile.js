module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    jsbeautifier: {
      files: ["*.js", "*.json", "!*.min.js"],
      options: {
        js: {
          indentSize: 2
        }
      }
    },

  });
  grunt.loadNpmTasks("grunt-jsbeautifier");

  grunt.registerTask('default', ['jsbeautifier']);

};
