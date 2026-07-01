export default class ArrayFamily {
	decodeFixArray(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		const length = bb.readUint8() & 0b00001111;

		const elements = [];

		for (let i = 0; i < length; i++) {
			elements.push(this.decode(bb));
		}

		return elements;
	}

	decode16ByteLengthArray(bb) {
		const length = bb.readUint16();

		const elements = [];

		for (let i = 0; i < length; i++) {
			elements.push(this.decode(bb));
		}

		return elements;
	}

	decode32ByteLengthArray(bb) {
		const length = bb.readUint32();

		const elements = [];

		for (let i = 0; i < length; i++) {
			elements.push(this.decode(bb));
		}

		return elements;
	}
}

