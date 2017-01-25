exports.config = {
	'paths': {
        'watched': ['browser'],
        'public':'public'
    },
  	'files': {
  		'javascripts': {
  			'entryPoints':{
  				'browser/scripts/calendar.js': 'scripts/calendar.js',
      			'browser/scripts/config.js': 'scripts/config.js'
  			}
  		},
    	'stylesheets': {
      		'joinTo': 'styles/calendar.css'
    	}
  	},
    'modules': {
        'autoRequire': {
            'scripts/calendar.js': ['browser/scripts/calendar']
        }
    },
    'server': {
        'port': 5000,
        'path': 'app.js'
    }
}