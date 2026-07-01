import Decoder from './index.js';
import msgpack from '@msgpack/msgpack';

const test = (input) => {
	const isEqual = JSON.stringify(new Decoder().decode(msgpack.encode(input))) === JSON.stringify(input);
	console.assert(isEqual, `test failed for input: ${JSON.stringify(input)}`);
};

test(true);
test(false);
test(null);
test(new Uint8Array([1, 2, 3]));
test(new Uint8Array(1000).fill(1));
test(new Uint8Array(100_000).fill(2));

