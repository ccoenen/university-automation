/* globals moment, structures, dispense, structureToDom */
(function () {
	'use strict';

	let currentStructure = {};

	function mergeStructures(a, b) {
		if (!b) { return a; }
		const output = JSON.parse(JSON.stringify(a)); // easy deep clone
		const merger = JSON.parse(JSON.stringify(b)); // easy deep clone

		if (output.contains && merger.contains && output.type !== 'file' && merger.type !== 'file') {
			merger.contains.forEach(mergeElement => {
				const outputElement = output.contains.find(outputElement => outputElement.name === mergeElement.name);

				if (outputElement && mergeElement.action === 'delete') {
					console.warn(`deletes ${mergeElement.name} from merged structure`);
					const oeIndex = output.contains.indexOf(outputElement);
					output.contains.splice(oeIndex, 1);
				} else if (outputElement) {
					const oeIndex = output.contains.indexOf(outputElement);
					output.contains.splice(oeIndex, 1);
					output.contains.push(mergeStructures(outputElement, mergeElement));
				} else {
					output.contains.push(mergeElement);
				}
			});
			output.contains.sort((a, b) => a.name.localeCompare(b.name));
		}

		return output;
	}

	window.structures.P2 = mergeStructures(baseStructure, window.structures.P2);
	window.structures.P4 = mergeStructures(baseStructure, window.structures.P4);
	window.structures.P6 = mergeStructures(baseStructure, window.structures.P6);
	// window.structures.P7 = mergeStructures(baseStructure, window.structures.P7); // P7 does not get merged!

	function populateDefaults() {
		URLtoForm();
		const now = moment();
		const ssws = [4,5,6,7,8,9].includes(now.month()) ? 'SS' : 'WS';
		let year = now.year();
		if (ssws === 'WS' && now.month() < 6) { year--; } // things turned in up to april 2020 probably belong to winter 2019/2020.
		document.getElementById('term').placeholder = `${year}-${ssws}`;
	}

	function propertiesFromDom() {
		return {
			filetype: 'project.json 2020',
			generatedOn: (new Date()).toISOString(),

			course: document.getElementById('course').value || document.getElementById('course').placeholder,
			term: document.getElementById('term').value || document.getElementById('term').placeholder,
			coaches: document.getElementById('coaches').value || 'unknown', // no placeholder here.

			teamMembers: document.getElementById('team-members').value || 'unknown', // no placeholder here.
			author: 'Team-' + (document.getElementById('team-number').value || 0),
			teamName: document.getElementById('team-name').value || '',
			productName: document.getElementById('product-name').value || '',
		};
	}

	function activateEventsListeners() {
		const form = document.querySelector('form');
		form.addEventListener('keyup', updatePreview);
		form.addEventListener('change', updatePreview);
		document.getElementById('course').addEventListener('change', updateURL);
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			dispense(currentStructure, propertiesFromDom());
		});
		window.addEventListener('popstate', (e) => {
			URLtoForm();
			updatePreview();
		});
	}

	function updatePreview() {
		const container = document.getElementById('preview');
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		const properties = propertiesFromDom();
		currentStructure = structures[properties.course];
		container.appendChild(structureToDom(currentStructure, properties));
	}

	function updateURL() {
		const currentProperties = propertiesFromDom();
		if (!history.state || history.state.course !== currentProperties.course) {
			history.pushState({}, '', '?course=' + currentProperties.course);
		}
	}

	function URLtoForm() {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('course')) {
			document.getElementById('course').value = urlParams.get('course');
		}
	}

	// update all on load of page
	populateDefaults();
	activateEventsListeners();
	updatePreview();
}());
