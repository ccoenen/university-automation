/* globals moment, */
(function () {
	'use strict';

	// set today as date
	document.getElementById('yymmdd').placeholder = moment().format('YYMMDD');

	// update all on load of page
	preparePreview(structure);

	const form = document.querySelector('form');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		dispense();
	});

	form.addEventListener('keyup', (e) => {
		preparePreview(structure);
	});

	form.addEventListener('change', (e) => {
		preparePreview(structure);
	});
}());
