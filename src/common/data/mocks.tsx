import { Item } from '../interfaces/item.interface';
import { List } from '../interfaces/list.interface';

export const lists: List[] = [
	{ id: '1', name: 'chores' },
	{ id: '2', name: 'dinners' }
];

export const items: Item[] = [
	{ id: '1', list_id: '1', name: 'vacumming', done: false },
	{ id: '2', list_id: '2', name: 'hot dogs', done: false },
	{ id: '3', list_id: '1', name: 'mowing', done: false },
	{ id: '4', list_id: '2', name: 'hamburgers', done: false },
	{ id: '5', list_id: '1', name: 'laundry', done: false },
	{ id: '6', list_id: '2', name: 'maccaroni', done: false }
];

export const emptyItem: Item = { id: '', list_id: '', name: '', done: false};
export const emptyList: List = { id: '', name: ''};
