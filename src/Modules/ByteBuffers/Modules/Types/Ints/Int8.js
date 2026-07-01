export default class Int8 {
	writeInt8(number) {
		this.ensureCapacity(this.offset + 1);

		this.view.setInt8(this.offset++, number, this.littleEndian);
		return this;
	}

	writeUint8(number) {
		this.ensureCapacity(this.offset + 1);

		this.view.setUint8(this.offset++, number, this.littleEndian);
		return this;
	}

	readUint8() {
		const number = this.view.getUint8(this.offset++, this.littleEndian);
		return number;
	}

	readInt8() {
		const number = this.view.getInt8(this.offset++, this.littleEndian);
		return number;
	}
}

