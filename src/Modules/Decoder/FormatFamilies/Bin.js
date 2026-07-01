export default class BinFamily {
	decode8ByteLengthBinArray(bb) {
		const length = bb.readUint8();
		const bytes = bb.readBytes(length).toBuffer();

		return new Uint8Array(bytes);
	}

	decode16ByteLengthBinArray(bb) {
		const length = bb.readUint16();
		const bytes = bb.readBytes(length).toBuffer();

		return new Uint8Array(bytes);
	}

	decode32ByteLengthBinArray(bb) {
		const length = bb.readUint32();
		const bytes = bb.readBytes(length).toBuffer();

		return new Uint8Array(bytes);
	}
}

