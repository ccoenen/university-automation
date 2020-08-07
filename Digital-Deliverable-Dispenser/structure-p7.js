(function () {
	'use strict';
	/**
	 * recursive definition of directories.
	 * @see `structure.js` for details
	 */


	const structure = {
		name: '<%= course %>_<%= term %>_Endabgabe_<%= teamMembers %>',
		contains: [
			{ name: '<%= course %>_<%= term %>_Doku', contains: [
				{ name: '<%= course %>_<%= term %>_Bachelorarbeit_<%= teamMembers %>' },
				{ name: '<%= course %>_<%= term %>_Forschungsarbeit_<%= teamMembers %>' },
				{ name: '<%= course %>_<%= term %>_Interaktives-Exposé_<%= teamMembers %>' }
			]},
			{ name: '<%= course %>_<%= term %>_Präsentationen_<%= teamMembers %>', contains: [
				{ name: '<%= course %>_<%= term %>_Bachelorpräsenstation_<%= teamMembers %>' },
				{ name: '<%= course %>_<%= term %>_Forschungspräsentation_<%= teamMembers %>' }
			]},
			{ name: '<%= course %>_<%= term %>_Produkt_<%= teamMembers %>', contains: [
				{ name: '<%= course %>_<%= term %>_Repository_<%= teamMembers %>' },
				{ name: '<%= course %>_<%= term %>_Betriebsanleitung_<%= teamMembers %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Inventarliste_<%= teamMembers %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Repository-Link_<%= teamMembers %>.txt', type: 'file' }
			]},
			{ name: '<%= course %>_<%= term %>_Projektprofil_<%= teamMembers %>', contains: [
				{ name: '<%= course %>_<%= term %>_Produktbilder_<%= teamMembers %>' },
				{ name: '<%= course %>_<%= term %>_DOR_<%= teamMembers %>.pdf', type: 'file' },
				{ name: '<%= course %>_<%= term %>_NVS_<%= teamMembers %>.pdf', type: 'file' },
			]},
			{ name: '<%= course %>_<%= term %>_Video_<%= teamMembers %>', contains: [
				{ name: '<%= course %>_<%= term %>_Produktvideo_<%= teamMembers %>.mp4', type: 'file' },
				{ name: '<%= course %>_<%= term %>_Produktvideo-Link_<%= teamMembers %>.txt', type: 'file' },
			]},
			{ name: 'project.json', type: 'file', contains: 'magic: properties' }
		]
	};

	window.structures = window.structures || {};
	window.structures.P7 = structure;
}());
