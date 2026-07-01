export default class Bytes {
	readBytes(length) {
		return this.slice(this.offset, this.offset + length);
	}
}

