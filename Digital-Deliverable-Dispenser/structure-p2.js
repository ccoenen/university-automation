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
				{ name: '<%= course %>_<%= term %>_Recherche_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Gesamtdoku_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Konzept_<%= author %>' },
			]},
			{ name: '<%= course %>_<%= term %>_Präsentationen_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Abschlusspräsentation_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Konzeptpräsentation_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Recherchepräsentation_<%= author %>' }
			]},
			{ name: '<%= course %>_<%= term %>_Produkt_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Repository_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Betriebsanleitung_<%= author %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Inventarliste_<%= author %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Repository-Link_<%= author %>.txt', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Produkt-Link_<%= author %>.txt', type: 'file' }
			]},
			{ name: '<%= course %>_<%= term %>_Projektprofil_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Produktbilder_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_DOR_<%= author %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_NVS_<%= author %>.pdf', type: 'file' },
			]},
			{ name: '<%= course %>_<%= term %>_Video_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Produktvideo_<%= author %>.mp4', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Produktvideo-Link_<%= author %>.txt', type: 'file' },
			]},
			{ name: 'project.json', type: 'file', contains: 'magic: properties' }
		]
	};

	window.structures = window.structures || {};
	window.structures.P2 = structure;
}());
