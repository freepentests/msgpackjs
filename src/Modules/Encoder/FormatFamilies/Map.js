export default class MapFamily {
	writeFixMap(object) {
		this.bb.writeUint8(0b10000000 | Object.keys(object).length);

		Object.entries(object).forEach(entry => {
			this.write(entry[0]);
			this.write(entry[1]);
		});
	}

	write16BitMap(object) {
		this.bb.writeUint8(0xde);
		this.bb.writeUint16(Object.keys(object).length);

		Object.entries(object).forEach(entry => {
			this.write(entry[0]);
			this.write(entry[1]);
		});
	}

	write32BitMap(object) {
		this.bb.writeUint8(0xdf);
		this.bb.writeUint32(Object.keys(object).length);

		Object.entries(object).forEach(entry => {
			this.write(entry[0]);
			this.write(entry[1]);
		});
	}

	writeMap(object) {
		const numItems = Object.keys(object).length;
		const isFixMap = numItems <= 15;
		const is16BitMap = numItems >= 16 && numItems < 2 ** 16;
		const is32BitMap = numItems >= 2 ** 16 && numItems < 2 ** 32;

		if (isFixMap) {
			this.writeFixMap(object);
		} else if (is16BitMap) {
			this.write16BitMap(object);
		} else if (is32BitMap) {
			this.write32BitMap(object);
		}
	}
}

MapFamily.prototype.writeObject = MapFamily.prototype.writeMap;

