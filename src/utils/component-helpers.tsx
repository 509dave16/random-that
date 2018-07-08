import { Item } from '../common/interfaces/item.interface';
import { List } from '../common/interfaces/list.interface';
import listService from '../common/services/list.service';

// NOTE: Do not use. Will not work for showing state changes to value
export function handleInputHoc() {
	return function(propName: string, event: any) {
		let leafReceiver = this;
		let lastPropName = propName;
		if (propName.indexOf('.') !== -1) {
			const path: string[] = propName.split('.');
			leafReceiver = path.reduce((receiver, nextPropName, index) => {
				const previousPropName = lastPropName;
				lastPropName = nextPropName;
				if (index < path.length - 1) {
					const nextReceiver = receiver[nextPropName];
					if (nextReceiver === undefined) {
						throw Error(
							`Prop '${lastPropName}' does not exist on object '${previousPropName}' in path '${nextPropName}'`
						);
					}
					return nextReceiver;
				}
				return receiver;
			}, this);
		}
		leafReceiver[lastPropName] = event.target.value;
	};
}

export function handleStateInputHoc() {
	return function(propName: string, event: any) {
		const stateNode = JSON.parse(JSON.stringify(this.state));
		let lastPropName = propName;
		let leafReceiver = stateNode;
		if (propName.indexOf('.') !== -1) {
			const path: string[] = propName.split('.');
			leafReceiver = path.reduce((receiver: any, nextPropName, index) => {
				const previousPropName = lastPropName;
				lastPropName = nextPropName;
				if (index < path.length - 1) {
					const nextReceiver = receiver[nextPropName];
					if (nextReceiver === undefined) {
						throw Error(
							`Prop '${nextPropName}' does not exist on object '${previousPropName}' in path '${propName}'`
						);
					}
					return nextReceiver;
				}
				return receiver;
			}, leafReceiver);
		}
		leafReceiver[lastPropName] = event.target.value;
		this.setState(stateNode);
	};
}

export function handleFormSubmitHoc() {
	return (e, callback) => {
		e.preventDefault();
		callback();
	};
}

export interface Breadcrumb {
	name: string;
	path: string;
}

export async function createBreadcrumbs(path: string): Promise<Breadcrumb[]> {
	const parts: string[] = path.split('/');
	const breadcrumbs: Breadcrumb[] = [];
	let subPath = '';
	let prevPart = '';
	for (const part of parts) {
		let name = part;
		if (part) {
			if (prevPart) {
				name = await getCrumbName(prevPart, part);
			}
			subPath += '/' + part;
			prevPart = part;
		}
		breadcrumbs.push({ name,  path: subPath});
	}
	return breadcrumbs;
}

export async function getCrumbName(type: string, value: string): Promise<string> {
	if (type === 'lists') {
		const list: List|undefined = await listService.getList(value);
		return list ? list.name : '';
	} else if (type === 'items') {
		const item: Item|undefined = await listService.getItem(value);
		return item ? item.name : '';
	}
	return value;
}
