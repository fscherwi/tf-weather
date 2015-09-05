/* istanbul ignore next */
module.exports = function(grunt) {

  grunt.initConfig({
    replace: {
      coverage: {
        src: ['*.js', '!Gruntfile.js'],
        overwrite: true,
        replacements: [{
          from: '/* istanbul ignore next */',
          to: ''
        }]
      }
    },
    shell: {
      new_folder: {
        command: 'mkdir coverage_files'
      },
      copy: {
        command: 'cp *.js ./coverage_files'
      },
      replace_coverage: {
        command: 'grunt replace_coverage_config'
      },
      publish: {
        command: 'npm publish'
      },
      move_back: {
        command: 'mv ./coverage_files/*.js ./'
      },
      remove_folder: {
        command: 'rm -rf coverage_files'
      }
    }
  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('replace_coverage_config', ['replace']);
  grunt.registerTask('publish', ['shell']);

};
