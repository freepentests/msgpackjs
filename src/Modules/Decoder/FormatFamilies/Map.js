export default class MapFamily {
	decodeObjectEntries(bb, length) {
		const object = {};

		for (let i = 0; i < length; i++) {
			const keyName = this.decode(bb);
			const keyData = this.decode(bb);
			object[keyName] = keyData;
		}

		return object;
	}

	decodeFixMap(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		const length = bb.readUint8() & 0b00001111;

		return this.decodeObjectEntries(bb, length);
	}

	decode16ByteLengthMap(bb) {
		const length = bb.readUint16();

		return this.decodeObjectEntries(bb, length);
	}

	decode32ByteLengthMap(bb) {
		const length = bb.readUint32();

		return this.decodeObjectEntries(bb, length);
	}
}

