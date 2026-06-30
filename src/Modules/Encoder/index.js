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

// yes, i got this test data from ChatGPT, but this isn't skidding since it's not code
const testData = {
	id: 123,
	negative: -42,
	bigNumber: 4294967295,
	float: 3.141592653589793,
	negativeFloat: -0.125,

	active: true,
	deleted: false,

	name: "Hello, MessagePack!",
	emptyString: "",
	unicode: "こんにちは 🌍",

	nothing: null,

	createdAt: new Date("2024-01-15T12:34:56.789Z"),

	bytes: new Uint8Array([0, 1, 2, 3, 254, 255]),
	clamped: new Uint8ClampedArray([10, 20, 30, 255]),

	numbers: [1, 2, 3, 4.5, -6],
	mixedArray: [
		true,
		false,
		null,
		"text",
		new Date("2023-05-01T00:00:00Z"),
		new Uint8Array([9, 8, 7]),
		{
			nested: {
				answer: 42,
				pi: 3.14,
				ok: true,
			},
		},
	],

	emptyArray: [],
	emptyObject: {},

	nested: {
		user: {
			id: 1,
			name: "Alice",
			tags: ["admin", "editor"],
		},
		settings: {
			darkMode: true,
			volume: 0.75,
		},
	},
};

console.log(new Encoder().encode(testData));

