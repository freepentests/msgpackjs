import Int8 from './Modules/Types/Ints/Int8.js';
import Int16 from './Modules/Types/Ints/Int16.js';
import Int32 from './Modules/Types/Ints/Int32.js';
import Int64 from './Modules/Types/Ints/Int64.js';
import Float32 from './Modules/Types/Floats/Float32.js';
import Float64 from './Modules/Types/Floats/Float64.js';
import CString from './Modules/Types/Strings/CString.js';
import IString from './Modules/Types/Strings/IString.js';
import VString from './Modules/Types/Strings/VString.js'; 
import UTF8String from './Modules/Types/Strings/UTF8String.js'; 
import Varint from './Modules/Types/Varints/Varint32.js'; 
import Bytes from './Modules/Types/Bytes/Bytes.js';
import BitSet from './Modules/Types/Bytes/BitSet.js';

import Mixin from './Modules/Mixin.js';

export default class ByteBuffer {
	#capacity;
	__isByteBuffer__ = true;

	static DEFAULT_CAPACITY = 16;
	static MAX_VARINT64_BYTES = 10;
	static MAX_VARINT32_BYTES = 5;
	static DEFAULT_ENDIAN = false;
	static BIG_ENDIAN = false; // a constant that can be used instead of the boolean value when instantiating a new ByteBuffer
	static LITTLE_ENDIAN = true; // a constant that can be used instead of the boolean value when instantiating a new ByteBuffer

	static isByteBuffer(bb) {
		return bb && bb.__isByteBuffer__; 
	}

	static accessor() {
		return DataView; // this is the only one thats supported so i would like to create a property rather than a method to get the accessor, but i want this to be backwards compatible with bytebuffer.js
	}

	static type() {
		return ArrayBuffer; 
	}

	static fromBinary(binary, littleEndian) {
		if (binary instanceof Uint8Array || binary instanceof Uint8ClampedArray) binary = binary.buffer;
		const bb = new ByteBuffer(binary.byteLength, littleEndian);
		bb.buffer = binary;
		bb.view = new DataView(binary);

		return bb;
	}

	static fromHex(value, littleEndian) {
		if (value.length % 2 !== 0) throw new Error('Hex string length mismatch; expected multiple of 2');

		const splitHexStringIntoTwoCharacterPairs = (string) => {
			if (string.length === 2) return [string];

			return [
				string.slice(0, 2),
				...splitHexStringIntoTwoCharacterPairs(string.slice(2))
			];
		};

		const splitted = splitHexStringIntoTwoCharacterPairs(value);

		const buffer = new Uint8Array(splitted.map(hexByte => parseInt(hexByte, 16))).buffer;

		return ByteBuffer.fromBinary(buffer, littleEndian);
	}

	static fromBase64(value, littleEndian) {
		const binary = new TextEncoder().encode(atob(value)).buffer;

		return ByteBuffer.fromBinary(binary, littleEndian);
	}

	static fromUTF8(value, littleEndian) {
		const binary = new TextEncoder().encode(value).buffer;

		return ByteBuffer.fromBinary(binary, littleEndian);
	}

	static wrap(value, littleEndian, encoding) {
		if (typeof encoding === 'undefined') {
			if (typeof value === 'string') encoding = 'utf8';
			else if (value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Array || value instanceof ArrayBuffer) encoding = 'binary';
			else throw new Error('Encoding type could not be inferred; please specify your desired encoding type in the function\'s arguments.');
		}

		switch (encoding) {
			case 'BIN':
			case 'bin':
			case 'BINARY':
			case 'binary':
				return ByteBuffer.fromBinary(value, littleEndian);

			case 'HEX':
			case 'hex':
				return ByteBuffer.fromHex(value, littleEndian);

			case 'BASE64':
			case 'base64':
				return ByteBuffer.fromBase64(value, littleEndian);

			case 'UTF8':
			case 'utf8':
				return ByteBuffer.fromUTF8(value, littleEndian);

			default:
				throw new TypeError(`Unrecognized encoding type: ${encoding}`);
		}
	}

	static allocate(capacity, littleEndian) {
		return new ByteBuffer(capacity, littleEndian);
	}

	constructor(capacity, littleEndian) {
		this.#capacity = capacity ?? ByteBuffer.DEFAULT_CAPACITY;

		this.limit = this.#capacity;
		this.littleEndian = littleEndian ?? ByteBuffer.DEFAULT_ENDIAN;

		this.buffer = new ArrayBuffer(this.#capacity);
		this.view = new DataView(this.buffer);

		this.offset = 0;
		this.markedOffset = -1;
	}

	flip() {
		this.limit = this.offset;
		this.offset = 0;

		return this;
	}

	clear() {
		this.limit = this.#capacity;
		this.markedOffset = -1;
		this.offset = 0;
		
		return this;
	}

	capacity() {
		return this.#capacity;
	}

	compact() {
		// implement later

		return this;
	}

	clone() {
		const bb = new ByteBuffer(this.#capacity, this.littleEndian);
		bb.buffer = this.buffer;
		bb.view = this.view;

		return bb;
	}

	fill(value, beginning, end) {
		beginning = beginning ?? this.offset;
		end = end ?? this.limit;

		if (value && typeof value === 'string') value = value.charCodeAt(0);

		for (let i = beginning; i < end; i++) this.view.setUint8(i, value);

		return this;
	}

	mark(offset) {
		offset = offset ?? this.offset;
		this.markedOffset = offset;

		return this;
	}

	order(littleEndian) {
		this.littleEndian = Boolean(littleEndian); 
		return this;
	}

	LE(littleEndian) {
		this.littleEndian = typeof littleEndian !== 'undefined' ? Boolean(littleEndian) : false;

		return this;
	}

	BE(bigEndian) {
		this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;

		return this;
	}

	remaining() {
		return this.limit - this.offset;
	}

	reset() {
		if (this.markedOffset !== -1) {
			this.offset = this.markedOffset;
			this.markedOffset = -1;
		} else {
			this.offset = 0;
		}

		return this;
	}

	resize(capacity) {
		this.#capacity = capacity;

		const typedArray = new Uint8Array(new ArrayBuffer(this.#capacity));
		typedArray.set(new Uint8Array(this.buffer));

		this.buffer = typedArray.buffer;
		this.view = new DataView(this.buffer);

		return this;
	}

	ensureCapacity(capacity) {
		if (this.#capacity < capacity) return this.resize(this.#capacity * 2 > capacity ? this.#capacity * 2 : capacity);
		return this;
	}

	reverse() {
		const typedArray = new Uint8Array(this.buffer);
		const newTypedArray = new Uint8Array(typedArray.length);

		for (let i = 0; i < typedArray.length; i++) {
			newTypedArray[typedArray.length - i] = typedArray[i];
		}

		this.buffer = newTypedArray.buffer;

		return this;
	}

	skip(places) {
		this.offset += places;
		return this;
	}

	toBuffer(forceCopy) {
		if (forceCopy) {
			const typedArray = new Uint8Array(this.buffer.byteLength);
			typedArray.set(new Uint8Array(this.buffer));
			return typedArray.buffer;
		}

		return this.buffer.slice(this.offset, this.limit);
	}

	slice(beginning, end) {
		const bb = this.clone();
		bb.offset = beginning ?? this.offset;
		bb.limit = end ?? this.limit;

		return bb;
	}

	append(bytes) {
		bytes.forEach(byte => {
			this.writeUint8(byte);
		});

		return this;
	}
}

Mixin.applyStaticAndInstanceMethods(ByteBuffer, Int8);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, Int16);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, Int32);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, Int64);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, Float32);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, Float64);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, CString);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, IString);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, VString);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, UTF8String);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, Varint);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, Bytes);
Mixin.applyStaticAndInstanceMethods(ByteBuffer, BitSet);

