module.exports = {
	darkMode: 'media',
  plugins: [
		//require('postcss-color-golf'),
    require('@tailwindcss/postcss'),
		require('cssnano')({
			"preset": "advanced"
		}),
  ]
}
