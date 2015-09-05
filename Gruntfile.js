/* istanbul ignore next */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    replace: {
      another_example: {
        src: ['*js'],
        dest: 'build/',
        //overwrite: true, // overwrite matched source files
        replacements: [{
          from: '/* istanbul ignore next */',
          to: ''
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('default', ['replace']);

};
