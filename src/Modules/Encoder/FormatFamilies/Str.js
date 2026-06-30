export default class StrFamily {
	writeFixStr(str, length) {
		this.bb.writeUint8(0b10100000 | length);
		this.bb.writeUTF8String(str);
	}

	write8BitStr(str, length) {
		this.bb.writeUint8(0xd9);
		this.bb.writeUint8(length);
		this.bb.writeUTF8String(str);
	}

	write16BitStr(str, length) {
		this.bb.writeUint8(0xda);
		this.bb.writeUint16(length);
		this.bb.writeUTF8String(str);
	}

	write32BitStr(str, length) {
		this.bb.writeUint8(0xdb);
		this.bb.writeUint32(length);
		this.bb.writeUTF8String(str);
	}

	writeStr(str) {
		const length = new TextEncoder().encode(str).length;

		const isFixStr = length <= 31;
		const is8BitString = length >= 32 && length < 2 ** 8;
		const is16BitString = length >= 2 ** 8 && length < 2 ** 16;
		const is32BitString = length >= 2 ** 16 && length < 2 ** 32;

		if (isFixStr) {
			this.writeFixStr(str, length);
		} else if (is8BitString) {
			this.write8BitStr(str, length);
		} else if (is16BitString) {
			this.write16BitStr(str, length);
		} else if (is32BitString) {
			this.write32BitStr(str, length);
		}
	}
}

StrFamily.prototype.writeString = StrFamily.prototype.writeStr;

