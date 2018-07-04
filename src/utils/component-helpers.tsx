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
