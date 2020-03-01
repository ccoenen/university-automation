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
	 * all strings (names and "contains" strings) are run through a templating engine.
	 */

	const structure = {
		name: '{{course}}_{{yymmdd}}_Endabgabe_{{author}}.zip',
		contains: [
			{ name: '{{course}}_{{yymmdd}}_Doku_{{author}}', contains: [
				{ name: '{{course}}_{{yymmdd}}_Forschungsarbeiten_{{author}}' },
				{ name: '{{course}}_{{yymmdd}}_Gesamtdoku_{{author}}' },
				{ name: '{{course}}_{{yymmdd}}_iDoku_{{author}}' },
				{ name: '{{course}}_{{yymmdd}}_Konzept_{{author}}' },
				{ name: '{{course}}_{{yymmdd}}_Synthese_{{author}}' }
			]},
			{ name: '{{course}}_{{yymmdd}}_Präsentationen_{{author}}', contains: [
				{ name: '{{course}}_{{yymmdd}}_Abschlusspräsentation_{{author}}' },
				{ name: '{{course}}_{{yymmdd}}_Konzeptpräsentation_{{author}}' }
			]},
			{ name: '{{course}}_{{yymmdd}}_Produkt_{{author}}', contains: [
				{ name: '{{course}}_{{yymmdd}}_Repository_{{author}}' },
				{ name: '{{course}}_{{yymmdd}}_Betriebsanleitung_{{author}}.pdf', type: 'file' },
				{ name: '{{course}}_{{yymmdd}}_Inventarliste_{{author}}.pdf', type: 'file' },
				{ name: '{{course}}_{{yymmdd}}_Repository-Link_{{author}}.txt', type: 'file' }
			]},
			{ name: '{{course}}_{{yymmdd}}_Projektprofil_{{author}}', contains: [
				{ name: '{{course}}_{{yymmdd}}_Produktbilder_{{author}}' },
				{ name: '{{course}}_{{yymmdd}}_DOR_{{author}}.pdf', type: 'file' },
				{ name: '{{course}}_{{yymmdd}}_NVS_{{author}}.pdf', type: 'file' },
			]},
			{ name: '{{course}}_{{yymmdd}}_Video_{{author}}', contains: [
				{ name: '{{course}}_{{yymmdd}}_Produktvideo_{{author}}.mp4', type: 'file' },
				{ name: '{{course}}_{{yymmdd}}_Produktvideo-Link_{{author}}.txt', type: 'file' },
			]},
			{ name: 'project.json', type: 'file'}
		]
	};

	window.structure = structure;
}());
