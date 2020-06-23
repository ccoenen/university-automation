/* globals JSZip, saveAs, _ */
(function () {
	'use strict';


	function dispense(structure, properties) {
		const renderedStructure = recursiveRendering(structure, properties);
		prepareZip(renderedStructure);
	}

	function recursiveRendering(structure, properties) {
		return _.mapObject(structure, (val, key) => {
			if (key === 'name') {
				// render name
				return _.template(val)(properties).replace(/ /g, '-');
			} else if (structure.name === 'project.json' && key === 'contains' && val === 'magic: properties' && structure.type === 'file') {
				// render project metadata
				return JSON.stringify(properties, null, '\t')+'\n';
			} else if (key === 'contains' && structure.type === 'file') {
				// render file contents
				return _.template(val)(properties);
			} else if (key === 'contains' && structure.type !== 'file') {
				// render subtree
				return val.map((i) => recursiveRendering(i, properties));
			} else {
				// nothing to do
				return val;
			}
		});
	}


	//// Concerning HTML output

	function structureToDom(structure, properties) {
		const renderedStructure = recursiveRendering(structure, properties);
		return entryToDom(recursiveRendering(renderedStructure));
	}

	function entryToDom(entry) {
		const element = document.createElement('li');
		element.appendChild(document.createTextNode(entry.name));
		element.classList.add(entry.type || 'directory');

		if (entry.type !== 'file' && entry.contains) {
			const subElements = document.createElement('ul');
			element.appendChild(subElements);

			entry.contains.forEach((item) => {
				subElements.appendChild(entryToDom(item));
			});
		}
		return element;
	}


	//// Concerning ZIP output

	function prepareZip(renderedStructure) {
		const zip = new JSZip();
		entryToZipContent(zip, renderedStructure);
		zip.generateAsync({type:'blob'})
			.then(function(content) {
				// see FileSaver.js
				saveAs(content, renderedStructure.name + '.zip');
			});
	}

	function entryToZipContent(zipHierarchy, entry) {
		if (entry.type !== 'file') {
			const f = zipHierarchy.folder(entry.name);
			if (entry.contains) {
				entry.contains.forEach((item) => {
					entryToZipContent(f, item);
				});
			}
		} else {
			zipHierarchy.file(entry.name, entry.contains || '');
		}
	}

	window.dispense = dispense;
	window.structureToDom = structureToDom;
}());
