export default class ArrayFamily {
	decodeArrayElements(bb, length) {
		const elements = [];

		for (let i = 0; i < length; i++) {
			elements.push(this.decode(bb));
		}

		return elements;
	}

	decodeFixArray(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		const length = bb.readUint8() & 0b00001111;

		return this.decodeArrayElements(bb, length);
	}

	decode16ByteLengthArray(bb) {
		const length = bb.readUint16();

		return this.decodeArrayElements(bb, length);
	}

	decode32ByteLengthArray(bb) {
		const length = bb.readUint32();

		return this.decodeArrayElements(bb, length);
	}
}

