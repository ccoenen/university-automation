/* globals moment, structure, dispense, structureToDom */
(function () {
	'use strict';

	// set today as date
	const now = moment();
	document.getElementById('yymmdd').placeholder = now.format('YYMMDD');
	const ssws = [4,5,6,7,8,9].includes(now.month()) ? 'SS' : 'WS';
	let year = now.year();
	if (ssws === 'WS' && now.month() < 6) { year--; } // things turned in in march 2020 belong to winter 2019/2020.
	document.getElementById('term').placeholder = `${year}-${ssws}`;

	// update all on load of page
	updatePreview(structure);

	function propertiesFromDom() {
		return {
			course: document.getElementById('course').value || document.getElementById('course').placeholder,
			yymmdd: document.getElementById('yymmdd').value || document.getElementById('yymmdd').placeholder,
			title: document.getElementById('title').value || document.getElementById('title').placeholder,
			author: document.getElementById('author').value || document.getElementById('author').placeholder,
			term: document.getElementById('term').value || document.getElementById('term').placeholder,
		};
	}

	const form = document.querySelector('form');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		dispense(structure, propertiesFromDom());
	});
	form.addEventListener('keyup', updatePreview);
	form.addEventListener('change', updatePreview);

	function updatePreview() {
		const container = document.getElementById('preview');
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		container.appendChild(structureToDom(structure, propertiesFromDom()));
	}

}());
