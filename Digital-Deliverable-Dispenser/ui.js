/* globals moment, structures, dispense, structureToDom */
(function () {
	'use strict';

	let currentStructure = {};

	function populateDefaults() {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('course')) {
			document.getElementById('course').value = urlParams.get('course');
		}
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
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			dispense(currentStructure, propertiesFromDom());
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

	// update all on load of page
	populateDefaults();
	activateEventsListeners();
	updatePreview();
}());
