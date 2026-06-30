import ArrayFamily from './FormatFamilies/Array.js';
import BinFamily from './FormatFamilies/Bin.js';
import BoolFamily from './FormatFamilies/Bool.js';
import DateFamily from './FormatFamilies/Date.js';
import ExtFamily from './FormatFamilies/Ext.js';
import FloatFamily from './FormatFamilies/Float.js';
import IntFamily from './FormatFamilies/Int.js';
import MapFamily from './FormatFamilies/Map.js';
import NilFamily from './FormatFamilies/Nil.js';
import StrFamily from './FormatFamilies/Str.js';

import MixinHelper from '../MixinHelper.js';

import ByteBuffer from 'bytebuffer'; 

export default class Encoder {
	constructor() {
		this.bb = new ByteBuffer();
	}

	write(data) {
		switch (typeof data) {
			case 'number':
				if (data % 1 !== 0) this.writeFloat(data);
				else this.writeInteger(data);
				break;

			case 'boolean':
				this.writeBool(data);
				break;

			case 'string':
				this.writeString(data);
				break;

			case 'object':
				if (data === null) return this.writeNull();
				else if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) this.writeBinArray(data);
				else if (data instanceof Array) this.writeArray(data);
				else if (data instanceof Date) this.writeDate(data);
				else this.writeMap(data);
				break;
		}

		return this.bb;
	}

	encode(data) {
		this.write(data);
		return new Uint8Array(this.bb.flip().toBuffer());
	}
}

MixinHelper.mixin(Encoder.prototype, ArrayFamily.prototype);
MixinHelper.mixin(Encoder.prototype, BinFamily.prototype);
MixinHelper.mixin(Encoder.prototype, BoolFamily.prototype);
MixinHelper.mixin(Encoder.prototype, DateFamily.prototype);
MixinHelper.mixin(Encoder.prototype, ExtFamily.prototype);
MixinHelper.mixin(Encoder.prototype, FloatFamily.prototype);
MixinHelper.mixin(Encoder.prototype, IntFamily.prototype);
MixinHelper.mixin(Encoder.prototype, MapFamily.prototype);
MixinHelper.mixin(Encoder.prototype, NilFamily.prototype);
MixinHelper.mixin(Encoder.prototype, StrFamily.prototype);

