exports.config = {
	'paths': {
        'watched': ['browser', 'views'],
        'public':'public'
    },
  	'files': {
  		'javascripts': {
            'joinTo': 'scripts/calendar.js'
  		},
    	'stylesheets': {
      		'joinTo': 'styles/calendar.css'
    	}
  	},
    'server': {
        'port': 5000,
        'path': 'app.js'
    },
    'plugins': {
        'pug': {
            'globals': ['App'],
            'basedir': ''
        }
    }
}