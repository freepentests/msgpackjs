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
test(1.123);
test(Math.PI);
test(100);
test(256);
test(555);
test(123123);
test(1_000_000);
//test(Number.MAX_SAFE_INTEGER);
test(-111);
test(-666);
test(-100_000);

