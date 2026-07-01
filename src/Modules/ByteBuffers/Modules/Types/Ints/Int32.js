export default class Int32 {
	writeInt32(number) {
		this.ensureCapacity(this.offset + 4);

		this.view.setInt32(this.offset, number, this.littleEndian);
		this.offset += 4;

		return this;
	}

	writeUint32(number) {
		this.ensureCapacity(this.offset + 4);

		this.view.setUint32(this.offset, number, this.littleEndian);
		this.offset += 4;

		return this;
	}

	readInt32() {
		const number = this.view.getInt32(this.offset, this.littleEndian);
		this.offset += 4;

		return number;
	}

	readUint32() {
		const number = this.view.getUint32(this.offset, this.littleEndian);
		this.offset += 4;

		return number;
	}
}

