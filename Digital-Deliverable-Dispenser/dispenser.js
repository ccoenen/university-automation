/* globals JSZip, saveAs, _, structure */
(function () {
	'use strict';


	function propertiesFromDom() {
		return {
			course: document.getElementById('course').value || document.getElementById('course').placeholder,
			yymmdd: document.getElementById('yymmdd').value || document.getElementById('yymmdd').placeholder,
			title: document.getElementById('title').value || document.getElementById('title').placeholder,
			author: document.getElementById('author').value || document.getElementById('author').placeholder,
			term: document.getElementById('term').value || document.getElementById('term').placeholder,
		};
	}

	function dispense() {
		const properties = propertiesFromDom();
		recursiveRendering(structure, properties);
		prepareZip(properties);
	}

	function recursiveRendering(structure, properties) {
		return _.mapObject(structure, (val, key) => {
			if (key === 'name') {
				return _.template(val)(properties);
			} else if (key === 'contains' && structure.type !== 'file') {
				return val.map((i) => recursiveRendering(i, properties));
			} else {
				return val;
			}
		});
	}

	function preparePreview() {
		const container = document.getElementById('preview');
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}

		const properties = propertiesFromDom();
		const renderedStructure = recursiveRendering(structure, properties);

		container.appendChild(entryToDom(recursiveRendering(renderedStructure)));
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
