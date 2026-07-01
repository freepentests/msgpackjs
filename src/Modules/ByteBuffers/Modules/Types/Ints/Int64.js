export default class Int64 {
	writeInt64(number) {
		this.ensureCapacity(this.offset + 8);

		this.view.setBigInt64(this.offset, BigInt(number), this.littleEndian);
		this.offset += 8;

		return this;
	}

	writeUint64(number) {
		this.ensureCapacity(this.offset + 8);

		this.view.setBigUint64(this.offset, BigInt(number), this.littleEndian);
		this.offset += 8;

		return this;
	}

	readInt64() {
		const bigInt = this.view.getBigInt64(this.offset, this.littleEndian);
		this.offset += 8;

		return Number(bigInt);
	}

	readUint64() {
		const bigInt = this.view.getBigUint64(this.offset, this.littleEndian);
		this.offset += 8;

		return Number(bigInt);
	}
}

