export default class NilFamily {
	writeNil() {
		this.bb.writeUint8(0xc0);
	}
}

NilFamily.prototype.writeNull = NilFamily.prototype.writeNil;

