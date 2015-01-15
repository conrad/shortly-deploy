module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      build: {
        src: [
          'public/client/*.js'
        ],
        dest: 'public/dist/production.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        src: 'public/dist/production.js',
        dest: 'public/dist/production.min.js'
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        '*.js',
        'public/client/*.js',
        'lib/*.js',
        'app/*/*.js',
        'app/*.js'
      ],
      options: {
        // force: 'false',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public',
          src: 'style.css',
          dest: 'public/dist',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    // git add -A
    gitadd: {
      task: {
        options: {
          force: true,
          all: true,
          cwd: '/Users/student/Desktop/shortly-deploy/'
        }
      }
    },

    // git commit -m "Repository updated on <current date time>"
    gitcommit: {
      task: {
        options: {
          message: 'Repository updated on ' + grunt.template.today(),
          allowEmpty: true,
          cwd: '/Users/student/Desktop/shortly-deploy/'
        }
      }
    },

    // git push azure master
    gitpush: {
      task: {
        options: {
          remote: 'azure',
          branch: 'master',
          cwd: '/Users/student/Desktop/shortly-deploy/'
        }
      }
    },

    // git push origin master
    gitpushOrigin: {
      task: {
        options: {
          remote: 'origin',
          branch: 'master',
          cwd: '~/Desktop/shortly-deploy'
        }
      }
    },

    shell: {
      prodServer: {
        // command:
        // add: "git add .",
        // commit: "git commit -m ''",
        // push: "git push azure master"
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest', 'jshint'
  ]);

  grunt.registerTask('build', [
    'jshint', 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      // grunt.task.run(['shell:prodServer:add', 'shell:prodServer:commit', 'shell:prodServer:push']);
      grunt.task.run(['git']);
      console.log('prod');
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('git', [
    'gitadd', 'gitcommit', 'gitpush'
  ]);

  grunt.registerTask('deploy', [
    'jshint', 'concat', 'uglify', 'cssmin'
  ]);
};
// Random comments so that we have somehting to add
