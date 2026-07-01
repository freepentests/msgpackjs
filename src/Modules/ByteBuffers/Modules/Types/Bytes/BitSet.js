export default class BitSet {
	writeBitSet(bitSet) {
		this.writeVarint(bitSet.length);

		const numBytes = bitSet.length / 8;
		let bit = 0;

		this.ensureCapacity(this.offset + 5 + numBytes);

		for (let i = 0; i < numBytes; i++) {
			const byte = (bitSet[bit++] & 1) |
				(bitSet[bit++] & 1) << 1 |
				(bitSet[bit++] & 1) << 2 |
				(bitSet[bit++] & 1) << 3 |
				(bitSet[bit++] & 1) << 4 |
				(bitSet[bit++] & 1) << 5 |
				(bitSet[bit++] & 1) << 6 |
				(bitSet[bit++] & 1) << 7;

			this.writeUint8(byte);
		}

		return this;
	}

	readBitSet() {
		const length = this.readVarint();
		const lengthInBytes = length / 8;
		let bitSet = new Array(length);
		let numBits = 0;
	
		while (numBits / 8 < lengthInBytes) {
			const byte = this.readUint8();
			bitSet[numBits++] = Boolean(byte & 1);
			bitSet[numBits++] = Boolean(byte & 1 << 1);
			bitSet[numBits++] = Boolean(byte & 1 << 2);
			bitSet[numBits++] = Boolean(byte & 1 << 3);
			bitSet[numBits++] = Boolean(byte & 1 << 4);
			bitSet[numBits++] = Boolean(byte & 1 << 5);
			bitSet[numBits++] = Boolean(byte & 1 << 6);
			bitSet[numBits++] = Boolean(byte & 1 << 7);
		}

		if (numBits > length) {
			const numBitsOverflowed = numBits % length;

			for (let i = 0; i < numBitsOverflowed; i++) {
				bitSet.pop();
			}
		}

		return bitSet;
	}
}

