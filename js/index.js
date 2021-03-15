import jsBeautify from 'https://cdn.skypack.dev/pin/js-beautify@v1.13.5-2EEqlZyJ10YMPjgwayEh/mode=imports,min/optimized/js-beautify.js';
import filterHTML from '/js/lib/filterHTML.js';
const prism = new Worker('/js/lib/prism.js');

new Vue({
	el: '#app',
	data: {
		input: '',
		query: '',
		output: '',
		error: '',
	},

	mounted: function () {
		this.setOutput()
	},

	watch: {
		query: function () {
			this.setOutput()
		},
		input: function () {
			this.setOutput()
		},
	},

	computed: {
		showInput: function () {
			return this.input == ''
		},
	},

	methods: {
		setOutput: function () {
			let { html, error } = filterHTML(this.input, this.query)
			this.error = error

			// Beautify
			const beautifyDefaults = {
				unformatted: ['code', 'pre'],
				indent_inner_html: true,
				indent_char: ' ',
				indent_size: 2,
				sep: '\n',
			}
			html = jsBeautify.html(html, beautifyDefaults)

			// Syntax
			prism.postMessage(JSON.stringify({ language: 'html', code: html }))
			prism.onmessage = ({ data }) => {
				this.output = data
			}
		},

		clearInput: function () {
			this.input = ''
		},
	},

	template: `
		<div class="App">
			<div class="input" v-if="showInput">
				<textarea v-model="input" placeholder="Paste some HTML..."></textarea>
			</div>
			<div class="content">
				<div class="filters">
					<div class="filter">
						<label for="query">Query</label>
						<span class="error">{{ error }}</span>
						<input type="text" id="query" v-model="query" placeholder="CSS selector..." autocomplete="off" />
					</div>
				</div>
				<div class="output">
					<div class="output-clear">
						<button v-on:click="clearInput">Clear HTML</button>
					</div>
					<pre v-html="output" />
				</div>
			</div>
		</div>
	`,
})