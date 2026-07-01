export default class Float64 {
	writeFloat64(number) {
		this.ensureCapacity(this.offset + 8);

		this.view.setFloat64(this.offset, number, this.littleEndian);
		this.offset += 8;

		return this;
	}

	readFloat64() {
		const number = this.view.getFloat64(this.offset, this.littleEndian);
		this.offset += 8;

		return number;
	}
}

