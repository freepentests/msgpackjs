export default class VString {
	writeVString(string) {
		this.writeVarint(string.length);
		this.writeUTF8String(string);

		return this;
	}

	readVString() {
		const length = this.readVarint();
		return this.readUTF8String(length);
	}
}

