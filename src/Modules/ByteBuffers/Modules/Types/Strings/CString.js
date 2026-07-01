export default class CString {
	writeCString(string) {
		this.writeUTF8String(string);
		this.writeUint8(0); // null terminator

		return this;
	}

	readCString() {
		const bytes = [];

		while (true) {
			const byte = this.readUint8();

			if (byte !== 0) bytes.push(byte);
			else break;
		}

		return new TextDecoder().decode(new Uint8Array(bytes));
	}
}

