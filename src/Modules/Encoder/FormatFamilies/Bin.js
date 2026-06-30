export default class BinFamily {
	write8BitBinArray(binArray) {
		this.bb.writeUint8(0xc4);
		this.bb.writeUint8(binArray.length);
		this.bb.append(new Uint8Array(binArray));
	}

	write16BitBinArray(binArray) {
		this.bb.writeUint8(0xc5);
		this.bb.writeUint16(binArray.length);
		this.bb.append(binArray);
	}

	write32BitBinArray(binArray) {
		this.bb.writeUint8(0xc6);
		this.bb.writeUint32(binArray.length);
		this.bb.append(binArray);
	}

	writeBinArray(binArray) {
		const is8BitBinArray = binArray.length >= 0 && binArray.length < 2 ** 8;
		const is16BitBinArray = binArray.length >= 2 ** 8 && binArray.length < 2 ** 16;
		const is32BitBinArary = binArray.length >= 2 ** 16 && binArray.length < 2 ** 32;

		if (is8BitBinArray) {
			this.write8BitBinArray(binArray);
		} else if (is16BitBinArray) {
			this.write16BitBinArray(binArray);
		} else if (is32BitBinArray) {
			this.write32BitBinArray(binArray);
		}
	}
}

BinFamily.prototype.writeBinaryArray = BinFamily.prototype.writeBinArray;

