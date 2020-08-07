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
				{ action: 'delete', name: '<%= course %>_<%= term %>_Forschungsarbeiten_<%= author %>' },
				{ action: 'delete', name: '<%= course %>_<%= term %>_Interaktives-Exposé_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Recherche_<%= author %>' },
			]},
			{ name: '<%= course %>_<%= term %>_Präsentationen_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Recherchepräsentation_<%= author %>' }
			]},
			{ name: '<%= course %>_<%= term %>_Produkt_<%= author %>', contains: [
				{ action: 'delete', name: '<%= course %>_<%= term %>_Proof-of-Concept_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Produkt-Link_<%= author %>.txt', type: 'file' }
			]}
		]
	};

	window.structures = window.structures || {};
	window.structures.P2 = structure;
}());
