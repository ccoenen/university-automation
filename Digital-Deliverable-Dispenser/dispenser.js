/* globals JSZip, saveAs, structure */
(function () {
	'use strict';


	function propertiesFromDom() {
		return {
			course: document.getElementById('term').value || document.getElementById('term').placeholder,
			yymmdd: document.getElementById('yymmdd').value || document.getElementById('yymmdd').placeholder,
			title: document.getElementById('title').value || document.getElementById('title').placeholder,
			author: document.getElementById('author').value || document.getElementById('author').placeholder,
			term: document.getElementById('term').value || document.getElementById('term').placeholder,
			type: document.getElementById('type').value || document.getElementById('type').placeholder
		};
	}

	function dispense() {
		const properties = propertiesFromDom();
		recursiveRendering(structure, properties);
		prepareZip(properties);
	}
/*
	function recursiveRendering(structure, properties, recursionDepth = 0) {
		for (let [key, value] of Object.entries(structure)) {
			if (key === 'contains' && typeof value.forEach === 'function') {
				value.map((item) => {
					return recursiveRendering(item, properties, recursionDepth + 1);
				});
			}
		}
	}
*/
	function preparePreview(structure) {
		const container = document.getElementById('preview');
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}

		container.appendChild(entryToDom(structure));
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

	function prepareZip(renderedStructure) {
		const zip = new JSZip();
		zip.file('Hello.txt', 'Hello World\n');
		var img = zip.folder('images');
		img.file('smile.gif', 'test');
		zip.generateAsync({type:'blob'})
			.then(function(content) {
				// see FileSaver.js
				saveAs(content, renderedStructure.name);
			});
	}

	window.dispense = dispense;
	window.preparePreview = preparePreview;
}());
