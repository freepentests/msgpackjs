export default class StrFamily {
	decodeFixStr(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		const initialByte = bb.readUint8();

		const stringLength = initialByte & 0b00011111;
		const stringContents = bb.readUTF8String(stringLength);

		return stringContents;
	}

	decode8ByteLengthString(bb) {
		const length = bb.readUint8();
		const string = bb.readUTF8String(length);

		return string;
	}

	decode16ByteLengthString(bb) {
		const length = bb.readUint16();
		const string = bb.readUTF8String(length);

		return string;
	}

	decode32ByteLengthString(bb) {
		const length = bb.readUint32();
		const string = bb.readUTF8String(length);

		return string;
	}
}

