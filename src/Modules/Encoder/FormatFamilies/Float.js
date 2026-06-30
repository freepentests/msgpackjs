export default class FloatFamily {
	writeFloat(float) {
		// only supports 64-bit floating point numbers at the moment

		this.bb.writeUint8(0xcb);
		this.bb.writeFloat64(float);
	}
}

