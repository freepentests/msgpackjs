export default class UTF8String {
	static calculateUTF8Bytes(string) {
		const stringContents = new TextEncoder().encode(string);
		return stringContents.length;
	}

	writeUTF8String(string) {
		const stringContents = new TextEncoder().encode(string);
		this.ensureCapacity(this.offset + stringContents.length);

		stringContents.forEach(charCode => {
			this.writeUint8(charCode);
		});

		return this;
	}

	readUTF8String(length) {
		const string = this.buffer.slice(this.offset, this.offset + length)
		this.offset += length;

		return new TextDecoder().decode(new Uint8Array(string));
	}
}

