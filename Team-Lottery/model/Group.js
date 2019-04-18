export default class Group {
	constructor(id) {
		this.id = id;
		this.members = [];

		this.domElement = document.createElement('div');
		this.domElement.lotteryGroup = this;

		this.domElement.id = 'group-' + this.id;
		this.domElement.classList.add('group');
		this.domElement.innerHTML = `<h2><span contentEditable="true">Team-${this.id + 1}</span></h2><ul></ul>`;
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
