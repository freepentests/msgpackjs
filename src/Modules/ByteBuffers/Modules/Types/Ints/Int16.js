export default class Int16 {
	writeInt16(number) {
		this.ensureCapacity(this.offset + 2);

		this.view.setInt16(this.offset, number, this.littleEndian);
		this.offset += 2;

		return this;
	}

	writeUint16(number) {
		this.ensureCapacity(this.offset + 2);

		this.view.setUint16(this.offset, number, this.littleEndian);
		this.offset += 2;

		return this;
	}

	readInt16() {
		const number = this.view.getInt16(this.offset, this.littleEndian);
		this.offset += 2;

		return number;
	}

	readUint16() {
		const number = this.view.getUint16(this.offset, this.littleEndian);
		this.offset += 2;

		return number;
	}
}

