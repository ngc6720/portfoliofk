import { defineConfig } from "vite"
import { resolve } from 'path'

export default defineConfig({
	esbuild: {
		// supported: {
		//   'top-level-await': true
		// },
		minifyWhitespace: true,
		minifyIdentifiers: true,
		minifySyntax: false,
	},
	build: {
		rollupOptions: {
			input: {
			main: resolve(__dirname, 'index.html'),
			'fk': resolve(__dirname, 'fk/index.html'),
			'projects': resolve(__dirname, 'projects/index.html'),
			'boite-a-tubes-2': resolve(__dirname, 'boite-a-tubes-2/index.html'),
			'echotopie': resolve(__dirname, 'echotopie/index.html'),
			'eclusophone': resolve(__dirname, 'eclusophone/index.html'),
			'errance-et-rois': resolve(__dirname, 'errance-et-rois/index.html'),
			'iris': resolve(__dirname, 'iris/index.html'),
			'ksora': resolve(__dirname, 'ksora/index.html'),
			'psyk': resolve(__dirname, 'psyk/index.html'),
			},
		},
	}

})