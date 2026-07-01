export default class ExtData {
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}

	setType(value) {
		this.type = value;

		return this;
	}

	setData(value) {
		this.data = value;

		return this;
	}
}

