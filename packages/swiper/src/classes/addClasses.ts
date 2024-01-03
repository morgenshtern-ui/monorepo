export function addClasses() {
	const swiper = this as any;

	const { classNames, params, rtl, el, device } = swiper;
	// prettier-ignore
	const suffixes = prepareClasses([
		'initialized',
		params.direction,
		{ 'free-mode': swiper.params.freeMode && params.freeMode.enabled },
		{ 'autoheight': params.autoHeight },
		{ 'rtl': rtl },
		{ 'grid': params.grid && params.grid.rows > 1 },
		{ 'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column' },
		{ 'android': device.android },
		{ 'ios': device.ios },
		{ 'css-mode': params.cssMode },
		{ 'centered': params.cssMode && params.centeredSlides },
		{ 'watch-progress': params.watchSlidesProgress },
	], params.containerModifierClass);
	classNames.push(...suffixes);
	el.classList.add(...classNames);
	swiper.emitContainerClasses();
}

function prepareClasses(entries: Array<Record<string, boolean> | string>, prefix: string) {
	const resultClasses: string[] = [];

	for (const item of entries) {
		if (typeof item === 'object') {
			const classNames = Object.keys(item);

			for (const className in classNames) {
				if (item[className]) {
					resultClasses.push(prefix + className);
				}
			}
		} else if (typeof item === 'string') {
			resultClasses.push(prefix + item);
		}
	}

	return resultClasses;
}
