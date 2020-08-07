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
				{ name: '<%= course %>_<%= term %>_Management_<%= author %>', contains: [
					{ name: '<%= course %>_<%= term %>_Projektkalkulation_<%= author %>', contains: [
						{ name: '<%= course %>_<%= term %>_Projektkalkulation_<%= author %>.pdf', type: 'file' },
						{ name: '<%= course %>_<%= term %>_Projektkalkulation_<%= author %>.ods', type: 'file' },
						{ name: '<%= course %>_<%= term %>_Projektkalkulation_<%= author %>.xlsx', type: 'file', optional: true }
					]},
					{ name: '<%= course %>_<%= term %>_Berechnung-Potentielle-Käufermenge_<%= author %>.pdf', type: 'file' },
					{ name: '<%= course %>_<%= term %>_Berechnung-Online-Marketingplan_<%= author %>.pdf', type: 'file' },
					{ name: '<%= course %>_<%= term %>_Lean-Canvas_<%= author %>.pdf', type: 'file' },
				]},
				{ name: '<%= course %>_<%= term %>_Synthese_<%= author %>' },
			]}
		]
	};

	window.structures = window.structures || {};
	window.structures.P4 = structure;
}());
