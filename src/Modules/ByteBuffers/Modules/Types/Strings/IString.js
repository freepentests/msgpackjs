export default class IString {
	writeIString(string) {
		this.writeUint32(string.length);
		this.writeUTF8String(string);

		return this;
	}

	readIString() {
		const length = this.readUint32();
		return this.readUTF8String(length);
	}
}

