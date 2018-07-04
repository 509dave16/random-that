import { ResourceDescriptor } from './resource-descriptor.interface';

export interface ResourceListOptions {
	title: string;
	instances: ResourceDescriptor[];
	childResourceType?: string;
	root?: string; // NOTE: This exists to handle the case where a navigation is done through an ion-nav element. e.g. /applications
}
