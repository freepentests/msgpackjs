export default class MixinHelper {
	static mixin(target, source) {
		Object.getOwnPropertyNames(source).forEach(propName => {
			if (propName !== 'constructor') {
				target[propName] = source[propName];
			}
		});
	}
}

