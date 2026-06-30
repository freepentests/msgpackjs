import ByteBuffer from 'bytebuffer';

export default class Encoder {
	constructor() {
		this.bb = new ByteBuffer();
	}

	writeNull() {
		this.bb.writeUint8(0xc0);

		return this.bb.flip();
	}

	writeBool(boolean) {
		this.bb.writeUint8(boolean ? 0xc3 : 0xc2);

		return this.bb.flip();
	}

	#writePositiveFixint(integer) {
		this.bb.writeUint8(integer)
	}

	#writeNegativeFixint(integer) {
		this.bb.writeUint8(0b11100000 | integer);
	}

	#writeUint8(integer) {
		this.bb.writeUint8(0xcc);
		this.bb.writeUint8(integer);
	}

	#writeUint16(integer) {
		this.bb.writeUint8(0xcd);
		this.bb.writeUint16(integer);
	}

	#writeUint32(integer) {
		this.bb.writeUint8(0xce);
		this.bb.writeUint32(integer);
	}

	#writeUint64(integer) {
		this.bb.writeUint8(0xcf);
		this.bb.writeUint64(integer);
	}

	#writeInt8(integer) {
		this.bb.writeUint8(0xd0);
		this.bb.writeUint8(Math.abs(integer));
	}

	#writeInt16(integer) {
		this.bb.writeUint8(0xd1);
		this.bb.writeUint16(Math.abs(integer));
	}

	#writeInt32(integer) {
		this.bb.writeUint8(0xd2);
		this.bb.writeUint32(Math.abs(integer));
	}

	#writeInt64(integer) {
		this.bb.writeUint8(0xd3);
		this.bb.writeUint32(Math.abs(integer));
	}

	writeInteger(integer) {
		const isPositiveFixint = integer <= 127 && integer >= 0;
		const isNegativeFixint = integer < 0 && integer >= -31;
		const isUint8 = integer >= 128 && integer < 2 ** 8;
		const isUint16 = integer >= 2 ** 8 && integer < 2 ** 16;
		const isUint32 = integer >= 2 ** 16 && integer < 2 ** 32;
		const isUint64 = integer >= 2 ** 32 && integer < 2 ** 64;
		const isInt8 = integer <= -32 && integer > -(2 ** 8);
		const isInt16 = integer <= -(2 ** 8) && integer > -(2 ** 16);
		const isInt32 = integer <= -(2 ** 16) && integer > -(2 ** 32);
		const isInt64 = integer <= -(2 ** 32) && integer > -(2 ** 64);

		if (isPositiveFixint) {
			this.#writePositiveFixint(integer);
		} else if (isNegativeFixint) {
			this.#writeNegativeFixint(integer);
		} else if (isUint8) {
			this.#writeUint8(integer);
		} else if (isUint16) {
			this.#writeUint16(integer);
		} else if (isUint32) {
			this.#writeUint32(integer);
		} else if (isUint64) {
			this.#writeUint64(integer);
		} else if (isInt8) {
			this.#writeInt8(integer)
		} else if (isInt16) {
			this.#writeInt16(integer);
		} else if (isInt32) {
			this.#writeInt32(integer);
		} else if (isInt64) {
			this.#writeInt64(integer);
		}

		return this.bb.flip();
	}
	
	writeFloat(float) {
		// only supports 64-bit floating point numbers at the moment

		this.bb.writeUint8(0xcb);
		this.bb.writeFloat64(float);

		return this.bb.flip();
	}

	#writeFixStr(str) {
		this.bb.writeUint8(0b10100000 & str.length);
		this.bb.writeUTF8String(str);
	}

	#write8BitStr(str) {
		this.bb.writeUint8(0xd9);
		this.bb.writeUint8(str.length);
		this.bb.writeUTF8String(str);
	}

	#write16BitStr(str) {
		this.bb.writeUint8(0xda);
		this.bb.writeUint16(str.length);
		this.bb.writeUTF8String(str);
	}

	#write32BitStr(str) {
		this.bb.writeUint8(0xdb);
		this.bb.writeUint32(str.length);
		this.bb.writeUTF8String(str);
	}

	writeString(str) {
		const isFixStr = str.length <= 31;
		const is8BitString = str.length >= 32 && str.length < 2 ** 8;
		const is16BitString = str.length >= 2 ** 8 && str.length < 2 ** 16;
		const is32BitString = str.length >= 2 ** 16 && str.length < 2 ** 32;

		if (isFixStr) {
			this.#writeFixStr(str);
		} else if (is8BitString) {
			this.#write8BitStr(str);
		} else if (is16BitString) {
			this.#write16BitStr(str);
		} else if (is32BitString) {
			this.#write32BitStr(str);
		}

		return this.bb.flip();
	}

	#write8BitBinArray(binArray) {
		this.bb.writeUint8(0xc4);
		this.bb.writeUint8(binArray.length);
		this.bb.writeBytes(binArray);
	}

	#write16BitBinArray(binArray) {
		this.bb.writeUint8(0xc5);
		this.bb.writeUint16(binArray.length);
		this.bb.writeBytes(binArray);
	}

	#write32BitBinArray(binArray) {
		this.bb.writeUint8(0xc6);
		this.bb.writeUint32(binArray.length);
		this.bb.writeBytes(binArray);
	}

	writeBinArray(binArray) {
		const is8BitBinArray = binArray.length >= 0 && binArray.length < 2 ** 8;
		const is16BitBinArray = binArray.length >= 2 ** 8 && binArray.length < 2 ** 16;
		const is32BitBinArary = binArray.length >= 2 ** 16 && binArray.length < 2 ** 32;

		if (is8BitBinArray) {
			this.#write8BitBinArray(binArray);
		} else if (is16BitBinArray) {
			this.#write16BitBinArray(binArray);
		} else if (is32BitBinArray) {
			this.#write32BitBinArray(binArray);
		}

		return this.bb.flip();
	}

	#writeFixArray(array) {
		this.bb.writeUint8(0b10010000 | array.length);
		
		array.forEach(elem => {
			this.write(elem);
		});
	}

	#write16BitArray(array) {
		this.bb.writeUint8(0xdc);
		this.bb.writeUint16(array.length);

		array.forEach(elem => {
			this.write(elem);
		});
	}

	#write32BitArray(array) {
		this.bb.writeUint8(0xdd);
		this.bb.writeUint32(array.length);

		array.forEach(elem => {
			this.write(elem);
		});
	}

	writeArray(array) {
		const isFixArray = array.length <= 15;
		const is16BitArray = array.length >= 16 && array.length < 2 ** 16;
		const is32BitArray = array.length >= 2 ** 16 && array.length < 2 ** 32;

		if (isFixArray) {
			this.#writeFixArray(array);
		} else if (is16BitArray) {
			this.#write16BitArray(array);
		} else if (is32BitArray) {
			this.#write32BitArray(array);
		}

		return this.bb.flip();
	}

	#writeFixMap(object) {
		this.bb.writeUint8(0b10000000 && Object.keys(object).length);

		Object.entries(object).forEach(entry => {
			this.write(entry[0]);
			this.write(entry[1]);
		});
	}

	#write16BitMap(object) {
		this.bb.writeUint8(0xde);
		this.bb.writeUint16(Object.keys(object).length);

		Object.entries(object).forEach(entry => {
			this.write(entry[0]);
			this.write(entry[1]);
		});
	}

	#write32BitMap(object) {
		this.bb.writeUint8(0xdf);
		this.bb.writeUint32(Object.keys(object).length);

		Object.entries(object).forEach(entry => {
			this.write(entry[0]);
			this.write(entry[1]);
		});
	}

	writeMap(object) {
		const numItems = Object.keys(object);
		const isFixMap = numItems <= 15;
		const is16BitMap = numItems >= 16 && numItems < 2 ** 16;
		const is32BitMap = numItems >= 2 ** 16 && numItems < 2 ** 32;

		if (isFixMap) {
			this.#writeFixMap(object);
		} else if (is16BitMap) {
			this.#write16BitMap(object);
		} else if (is32BitMap) {
			this.#write32BitMap(object);
		}

		return this.bb.flip();
	}

	write(data) {
		switch (typeof data) {
			case 'number':
				if (data % 1 !== 0) return this.writeInteger(data);
				else return this.writeFloat(data);
				break;

			case 'boolean':
				return this.writeBool(data);
				break;

			case 'string':
				return this.writeString(data);
				break;

			case 'object':
				if (data === null) return this.writeNull();
				else if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) return this.writeBinArray(data);
				else if (data instanceof Array) return this.writeArray(data);
				else return this.writeMap(data);
				break;
		}
	}
}

