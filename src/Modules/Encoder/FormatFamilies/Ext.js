export default class ExtFamily {
	writeExtension(type, data) {
		const isFixExt1 = data.length === 1;
		const isFixExt2 = data.length === 2;
		const isFixExt4 = data.length === 4;
		const isFixExt8 = data.length === 8;
		const isFixExt16 = data.length === 16;
		const isExt8 = data.length >= 0 && data.length < 2 ** 8;
		const isExt16 = data.length >= 2 ** 8 && data.length < 2 ** 16;
		const isExt32 = data.length >= 2 ** 16 && data.length < 2 ** 32;

		if (isFixExt1) {
			this.bb.writeUint8(0xd4);
		} else if (isFixExt2) {
			this.bb.writeUint8(0xd5);
		} else if (isFixExt4) {
			this.bb.writeUint8(0xd6);
		} else if (isFixExt8) {
			this.bb.writeUint8(0xd7);
		} else if (isFixExt16) {
			this.bb.writeUint8(0xd8);
		} else if (isExt8) {
			this.bb.writeUint8(0xc7);
			this.bb.writeUint8(data.length);
		} else if (isExt16) {
			this.bb.writeUint8(0xc8);
			this.bb.writeUint16(data.length);
		} else if (isExt32) {
			this.bb.writeUint8(0xc9);
			this.bb.writeUint32(data.length);
		}

		this.bb.writeInt8(type);
		this.bb.append(data);
	}
}

ExtFamily.prototype.writeExt = ExtFamily.prototype.writeExtension;

