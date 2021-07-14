(function () {
	"use strict";
	/**
	 * recursive definition of directories.
	 * @see `structure.js` for details
	 */

	const structure = {
		name: "<%= course %>_<%= term %>_Endabgabe_<%= author %>",
		contains: [
			{
				name: "<%= course %>_<%= term %>_Doku_<%= author %>",
				contains: [
					{ name: "<%= course %>_<%= term %>_Doku-Technik_<%= author %>" },
					{ name: "<%= course %>_<%= term %>_Doku-Management_<%= author %>" },
					{ name: "<%= course %>_<%= term %>_Synthese_<%= author %>" },
				],
			},
			{
				name: "<%= course %>_<%= term %>_Präsentationen_<%= author %>",
				contains: [
					{
						name: "<%= course %>_<%= term %>_Researchpräsentation_<%= author %>",
					},
				],
			},
		],
	};

	window.structures = window.structures || {};
	window.structures.P4 = structure;
})();
