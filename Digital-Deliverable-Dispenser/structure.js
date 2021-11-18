(function () {
	'use strict';
	/**
	 * recursive definition of directories.
	 *
	 * The root entry will be the zipfile itself.
	 * Each entry needs at least a `name` property.
	 * Entries may define a `type` property. may be any of the following:
	 *   - directory (default)
	 *   - file
	 * Entries may define a `contains` property. This can either be:
	 *   - an array (for directories)
	 *   - a string (for files)
	 *
	 * all strings (names and "contains" strings) are run through a underscore's
	 * templating engine. @see http://underscorejs.org/#template
	 */

	const structure = {
		name: '<%= course %>_<%= term %>_Endabgabe_<%= author %>',
		contains: [
			{ name: '<%= course %>_<%= term %>_Doku_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Gesamtdoku_<%= author %>' },
				// { name: '<%= course %>_<%= term %>_Konzept_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Forschungsarbeiten_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Erlebbares-Management-Summary_<%= author %>' }
			]},
			{ name: '<%= course %>_<%= term %>_Präsentationen_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Abschlusspräsentation_<%= author %>' },
				// { name: '<%= course %>_<%= term %>_Konzeptpräsentation_<%= author %>' }
			]},
			{ name: '<%= course %>_<%= term %>_Produkt_<%= author %>', contains: [
				{ name: '<%= course %>_<%= term %>_Repository_<%= author %>' },
				{ name: '<%= course %>_<%= term %>_Betriebsanleitung_<%= author %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Inventarliste_<%= author %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Repository-Link_<%= author %>.txt', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Proof-of-Concept_<%= author %>' },
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

	window.baseStructure = structure;
}());
