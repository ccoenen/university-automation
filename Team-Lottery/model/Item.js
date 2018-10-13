export default class Item {
	constructor(id, line, hash) {
		const bits = line.split('\t');
		this.id = id;
		this.label = bits.shift();
		this.gender = bits.shift();
		this.tags = bits;
		this.hash = hash;
		this.domElement = document.createElement('div');
		this.domElement.lotteryItem = this; // way back if all you got is the domElement

		this.domElement.id = 'candidate-' + id;
		this.domElement.classList.add('candidate');
		this.domElement.classList.add(`gender-${this.gender}`);
		this.domElement.innerHTML = `${this.label} (<code>${this.hash}</code>)<br>
			<span class="tag">${this.tags.join('</span><span class="tag">')}</span>`;
	}
}
