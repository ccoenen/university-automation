export default class Group {
	constructor(id) {
		this.id = id;
		this.members = [];

		this.domElement = document.createElement('div');
		this.domElement.lotteryGroup = this;

		this.domElement.id = 'group-' + this.id;
		this.domElement.classList.add('group');
		this.domElement.innerHTML = `<h2>Gruppe ${this.id + 1}</h2><ul></ul>`;
	}

	add(item) {
		this.domElement.appendChild(item.domElement);
		this.members.push(item);
	}
}
