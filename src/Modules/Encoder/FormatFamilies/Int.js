export default class IntFamily {
	writePositiveFixint(integer) {
		this.bb.writeUint8(integer)
	}

	writeNegativeFixint(integer) {
		this.bb.writeUint8(0b11100000 | integer);
	}

	writeUint8(integer) {
		this.bb.writeUint8(0xcc);
		this.bb.writeUint8(integer);
	}

	writeUint16(integer) {
		this.bb.writeUint8(0xcd);
		this.bb.writeUint16(integer);
	}

	writeUint32(integer) {
		this.bb.writeUint8(0xce);
		this.bb.writeUint32(integer);
	}

	writeUint64(integer) {
		this.bb.writeUint8(0xcf);
		this.bb.writeUint64(integer);
	}

	writeInt8(integer) {
		this.bb.writeUint8(0xd0);
		this.bb.writeInt8(integer);
	}

	writeInt16(integer) {
		this.bb.writeUint8(0xd1);
		this.bb.writeInt16(integer);
	}

	writeInt32(integer) {
		this.bb.writeUint8(0xd2);
		this.bb.writeInt32(integer);
	}

	writeInt64(integer) {
		this.bb.writeUint8(0xd3);
		this.bb.writeInt64(integer);
	}

	writeInteger(integer) {
		const isPositiveFixint = integer <= 127 && integer >= 0;
		const isNegativeFixint = integer < 0 && integer >= -32;
		const isUint8 = integer >= 128 && integer < 2 ** 8;
		const isUint16 = integer >= 2 ** 8 && integer < 2 ** 16;
		const isUint32 = integer >= 2 ** 16 && integer < 2 ** 32;
		const isUint64 = integer >= 2 ** 32 && integer < 2 ** 64;
		const isInt8 = integer <= -33 && integer > -(2 ** 8);
		const isInt16 = integer <= -(2 ** 8) && integer > -(2 ** 16);
		const isInt32 = integer <= -(2 ** 16) && integer > -(2 ** 32);
		const isInt64 = integer <= -(2 ** 32) && integer > -(2 ** 64);

		if (isPositiveFixint) {
			this.writePositiveFixint(integer);
		} else if (isNegativeFixint) {
			this.writeNegativeFixint(integer);
		} else if (isUint8) {
			this.writeUint8(integer);
		} else if (isUint16) {
			this.writeUint16(integer);
		} else if (isUint32) {
			this.writeUint32(integer);
		} else if (isUint64) {
			this.writeUint64(integer);
		} else if (isInt8) {
			this.writeInt8(integer)
		} else if (isInt16) {
			this.writeInt16(integer);
		} else if (isInt32) {
			this.writeInt32(integer);
		} else if (isInt64) {
			this.writeInt64(integer);
		}
	}
}

IntFamily.prototype.writeInt = IntFamily.prototype.writeInteger;

