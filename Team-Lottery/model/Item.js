export default class Item {
	constructor(id, line, hash) {
		const bits = line.split(/[\t;]/);
		this.id = id;
		this.label = bits.shift();
		this.gender = bits.shift();
		this.tags = bits;
		this.hash = hash;
		this.group = null;
		this.domElement = document.createElement('div');
		this.domElement.lotteryItem = this; // way back if all you got is the domElement

		this.domElement.id = 'candidate-' + id;
		this.domElement.classList.add('candidate');
		this.domElement.classList.add(`gender-${this.gender}`);
		const tagStuff = this.tags.map((t) => `<span class="tag" data-tag-name="${t}"></span>`).join('<br>');
		let labelStuff;
		if (this.label.indexOf(', ')) {
			labelStuff = this.label.split(', ').reverse().join('<br>');
		}
		this.domElement.innerHTML =
			`<code class="hash">${this.hash}</code>` +
			`<span class="tags">${tagStuff}</span>` +
			`<span class="name">${labelStuff || this.label}</span>`;
	}
}
