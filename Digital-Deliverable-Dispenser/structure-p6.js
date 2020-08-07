(function () {
	'use strict';
	/**
	 * recursive definition of directories.
	 * @see `structure.js` for details
	 */

	const structure = {
		name: '<%= course %>_<%= term %>_Endabgabe_<%= author %>',
		contains: [
			{ name: '<%= course %>_<%= term %>_Doku_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Management_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Synthese_<%= author %>' }
			]}
		]
	};

	window.structures = window.structures || {};
	window.structures.P6 = structure;
}());
