'use strict';

function dispense() {
	const teamname = document.getElementById('teamname').value;
	const filename = `P3_${teamname}.zip`;

	const zip = new JSZip();
	zip.file('Hello.txt', 'Hello World\n');
	var img = zip.folder('images');
	img.file('smile.gif', 'test');
	zip.generateAsync({type:'blob'})
		.then(function(content) {
			// see FileSaver.js
			saveAs(content, filename);
		});
}
