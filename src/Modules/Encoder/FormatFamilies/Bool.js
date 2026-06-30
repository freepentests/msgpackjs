export default class BoolFamily {
	writeBool(boolean) {
		this.bb.writeUint8(boolean ? 0xc3 : 0xc2);
	}
}

BoolFamily.prototype.writeBoolean = BoolFamily.prototype.writeBool;

