export default class ExtFamily {
	decodeTimestamp32(bytes) {
		const bb = ByteBuffer.wrap(bytes);
		const seconds = bb.readUint32();
		const dateObject = new Date(seconds * 1000);

		return dateObject;
	}

	decodeFixext(bb, length) {
		const type = bb.readInt8();
		const bytes = bb.readBytes(length).toBuffer();

		if (length === 4 && type === -1) {
			return this.decodeTimestamp32(bytes);
		}

		return new ExtData(type, new Uint8Array(bytes));
	}

	decodeExt8(bb) {
		const length = bb.readUint8();
		const type = bb.readInt8();

		const bytes = bb.readBytes(length).toBuffer();
		return new ExtData(type, new Uint8Array(bytes));
	}

	decodeExt16(bb) {
		const length = bb.readUint16();
		const type = bb.readInt8();

		const bytes = bb.readBytes(length).toBuffer();
		return new ExtData(type, new Uint8Array(bytes));
	}

	decodeExt32(bb) {
		const length = bb.readUint32();
		const type = bb.readInt8();

		const bytes = bb.readBytes(length).toBuffer();
		return new ExtData(type, new Uint8Array(bytes));
	}
}

