export default class Group {
	constructor(id, prefix) {
		this.id = id;
		this.members = [];
		this.title = `${prefix}-${this.id + 1}`;

		this.domElement = document.createElement('div');
		this.domElement.lotteryGroup = this;

		this.domElement.id = 'group-' + this.id;
		this.domElement.classList.add('group');
		this.domElement.innerHTML = `<h2><span contentEditable="true">${this.title}</span></h2><ul></ul>`;
	}

	add(item) {
		this.domElement.appendChild(item.domElement);
		this.members.push(item);

		// remove from previous group
		let oldGroup = item.group;
		if (oldGroup !== null) {
			const oldId = oldGroup.members.indexOf(item);
			if (oldId > -1) {
				oldGroup.members.splice(oldId, 1);
			}
		}

		item.group = this;
	}
}
