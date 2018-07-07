export function toggleClassesOnEvents(el: HTMLElement, eventToClassesMap: any[]) {
	if (!el) {
		return;
	}
	const allClasses: string[] = [];
	for (const eventName in eventToClassesMap) {
		const eventClasses: string[] = eventToClassesMap[eventName];
		el.addEventListener(eventName, (e) => {
			const classesToRemove: string[] = allClasses.filter((className: string) => !eventClasses.includes(className));
			classesToRemove.forEach((className) => el.classList.remove(className));
			eventClasses.forEach((className) => el.classList.add(className));
		});
		const classesToAdd: string[] = eventClasses.filter((className: string) => !allClasses.includes(className));
		classesToAdd.forEach((className) => allClasses.push(className));
	}
}

export function toggleClassesOnHover(el: HTMLElement, classes: string[]) {
	const eventToClassesMap: any = {
		mouseleave: [],
		mouseover: classes
	};
	toggleClassesOnEvents(el, eventToClassesMap);
}

export function toggleClassesOnTouch(el: HTMLElement, classes: string[]) {
	const eventToClassesMap: any = {
		touchend: classes,
		touchstart: []
	};
	toggleClassesOnEvents(el, eventToClassesMap);
}

export function toggleClassesOnInteract(el: HTMLElement, classes: string[]) {
	const eventToClassesMap: any = {
		mouseleave: [],
		mouseover: classes,
		touchend: [],
		touchstart: classes
	};
	toggleClassesOnEvents(el, eventToClassesMap);
}
