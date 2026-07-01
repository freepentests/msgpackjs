export default class ArrayFormat {
	writeArrayElems(array) {
		array.forEach(elem => {
			this.write(elem);
		});
	}

	writeFixArray(array) {
		this.bb.writeUint8(0b10010000 | array.length);

		this.writeArrayElems(array);
	}

	write16BitArray(array) {
		this.bb.writeUint8(0xdc);
		this.bb.writeUint16(array.length);

		this.writeArrayElems(array);
	}

	write32BitArray(array) {
		this.bb.writeUint8(0xdd);
		this.bb.writeUint32(array.length);

		this.writeArrayElems(array);
	}

	writeArray(array) {
		const isFixArray = array.length <= 15;
		const is16BitArray = array.length >= 16 && array.length < 2 ** 16;
		const is32BitArray = array.length >= 2 ** 16 && array.length < 2 ** 32;

		if (isFixArray) {
			this.writeFixArray(array);
		} else if (is16BitArray) {
			this.write16BitArray(array);
		} else if (is32BitArray) {
			this.write32BitArray(array);
		}
	}
}

