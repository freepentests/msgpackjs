import ArrayFamily from './FormatFamilies/Array.js';
import BinFamily from './FormatFamilies/Bin.js';
import ExtFamily from './FormatFamilies/Ext.js';
import MapFamily from './FormatFamilies/Map.js';
import StrFamily from './FormatFamilies/Str.js';
import TypeIdentifiers from './TypeIdentifiers.js';

import ExtData from '../ExtData.js';
import MixinHelper from '../MixinHelper.js';

import ByteBuffer from 'bytebuffer'; 

export default class Decoder {
	decodePositiveFixint(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		return bb.readUint8() & 0b01111111;
	}

	decodeNegativeFixint(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		return bb.readUint8() - 256;
	}

	decode(data) {
		const bb = data.__isByteBuffer__ ? data : ByteBuffer.wrap(data);

		const typeIdentifier = bb.readUint8(); // the first byte identifies the type of data that has been encoded (type identifier)

		const isPositiveFixint = typeIdentifier >= 0 && typeIdentifier < 128;
		const isNegativeFixint = typeIdentifier >= TypeIdentifiers.negativeFixint && typeIdentifier < TypeIdentifiers.negativeFixint + 32;
		const isFixStr = typeIdentifier >= TypeIdentifiers.fixStr && typeIdentifier < TypeIdentifiers.fixStr + 32;
		const isFixArray = typeIdentifier >= TypeIdentifiers.fixArray && typeIdentifier < TypeIdentifiers.fixArray + 16;
		const isFixMap = typeIdentifier >= TypeIdentifiers.fixMap && typeIdentifier < TypeIdentifiers.fixMap + 16;

		if (isPositiveFixint) {
			return this.decodePositiveFixint(bb);
		} else if (isNegativeFixint) {
			return this.decodeNegativeFixint(bb);
		} else if (isFixStr) {
			return this.decodeFixStr(bb);
		} else if (isFixArray) {
			return this.decodeFixArray(bb);
		} else if (isFixMap) {
			return this.decodeFixMap(bb);
		}

		switch (typeIdentifier) {
			case TypeIdentifiers.trueBool: return true;
			case TypeIdentifiers.falseBool: return false;
			case TypeIdentifiers.nil: return null;

			case TypeIdentifiers.binArray8Byte: return this.decode8ByteLengthBinArray(bb);
			case TypeIdentifiers.binArray16Byte: return this.decode16ByteLengthBinArray(bb);
			case TypeIdentifiers.binArray32Byte: return this.decode32ByteLengthBinArray(bb);

			case TypeIdentifiers.float32: return bb.readFloat32();
			case TypeIdentifiers.float64: return bb.readFloat64();

			case TypeIdentifiers.uint8: return bb.readUint8();
			case TypeIdentifiers.uint16: return bb.readUint16();
			case TypeIdentifiers.uint32: return bb.readUint32();
			case TypeIdentifiers.uint64: return bb.readUint64();

			case TypeIdentifiers.int8: return bb.readInt8();
			case TypeIdentifiers.int16: return bb.readInt16();
			case TypeIdentifiers.int32: return bb.readInt32();
			case TypeIdentifiers.int64: return bb.readInt64();

			case TypeIdentifiers.str8Byte: return this.decode8ByteLengthString(bb);
			case TypeIdentifiers.str16Byte: return this.decode16ByteLengthString(bb);
			case TypeIdentifiers.str32Byte: return this.decode32ByteLengthString(bb);

			case TypeIdentifiers.array16Byte: return this.decode16ByteLengthArray(bb);
			case TypeIdentifiers.array32Byte: return this.decode32ByteLengthArray(bb);

			case TypeIdentifiers.map16Byte: return this.decode16ByteLengthMap(bb);
			case TypeIdentifiers.map32Byte: return this.decode32ByteLengthMap(bb);

			case TypeIdentifiers.fixExt1: return this.decodeFixext(bb, 1);
			case TypeIdentifiers.fixExt2: return this.decodeFixext(bb, 2);
			case TypeIdentifiers.fixExt4: return this.decodeFixext(bb, 4);
			case TypeIdentifiers.fixExt8: return this.decodeFixext(bb, 8);
			case TypeIdentifiers.fixExt16: return this.decodeFixext(bb, 16);

			case TypeIdentifiers.ext8: return this.decodeExt8(bb);
			case TypeIdentifiers.ext16: return this.decodeExt16(bb);
			case TypeIdentifiers.ext32: return this.decodeExt32(bb);
		}
	}
}

MixinHelper.mixin(Decoder.prototype, ArrayFamily.prototype);
MixinHelper.mixin(Decoder.prototype, BinFamily.prototype);
MixinHelper.mixin(Decoder.prototype, ExtFamily.prototype);
MixinHelper.mixin(Decoder.prototype, MapFamily.prototype);
MixinHelper.mixin(Decoder.prototype, StrFamily.prototype);

