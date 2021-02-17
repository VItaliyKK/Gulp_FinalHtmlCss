module.exports = {
	html: {
		src: 'src/*.html',
        dest: 'docs'
	},
	styles: {
		src: 'src/styles/*.scss',
        dest: 'docs/styles'
	},
	scripts: {
		src: 'src/scripts/*.js',
        dest: 'docs/scripts'
	},
	images: {
		src: 'src/assets/**/*.*',
        dest: 'docs/assets'
	},
	fonts: {
		src: 'src/fonts/**/*.{ttf,otf}',
        dest: 'docs/fonts'
	}
};
