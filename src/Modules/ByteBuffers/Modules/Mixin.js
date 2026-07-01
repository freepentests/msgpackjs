// utility for applying mixins and stuff

export default class Mixin {
	static applyMixin(target, source) {
		Object.getOwnPropertyNames(source).forEach(propName => {
			if (!target[propName]) target[propName] = source[propName];
		});
	}

	static applyStaticAndInstanceMethods(target, source) {
		Mixin.applyMixin(target, source);
		Mixin.applyMixin(target.prototype, source.prototype);
	}
}

