// import { items, lists } from '../data/mocks';
import { Item } from '../interfaces/item.interface';
import { List } from '../interfaces/list.interface';
import { gunUser } from './gun.service';
import uuid from 'uuid/v4';

class ListService {
	public async getLists(): Promise<List[]> {
		console.log('here');
		const node = gunUser.get('lists');
		const promise = new Promise((resolve, reject) => {
			node.map((data) => {
				const itemKeys = Object.getOwnPropertyNames(data);
				console.log(itemKeys);
				console.log(data);
				resolve([]);
			});
		});
		const result = await promise;
		console.log(node);
		console.log(result);
		console.log('here');
		return Promise.resolve([]);
	}

	public async clearLists(): Promise<any> {
		return gunUser.get('lists').put({}).then();
	}

	public async getList(listId: string): Promise<List|undefined> {
		const lists: List[] = await this.getLists();
		return Promise.resolve(lists.find((list) => list.id === listId));
	}

	public getItems(): Promise<Item[]> {
		return new Promise((resolve, reject) => {
			gunUser.get('items').once((data) => {
				resolve(data || []);
			});
		});
	}

	private setList(list: List): Promise<any> {
		return gunUser.get('lists').set(list).then();
	}

	private setItem(item: Item): Promise<any> {
		return gunUser.get('items').set(item).then();
	}

	public async getListItems(listId: string): Promise<Item[]> {
		const items: Item[] = await this.getItems();
		return Promise.resolve(items.filter((item) => item.list_id === listId));
	}

	public async getItem(itemId: string): Promise<Item|undefined> {
		const items: Item[] = await this.getItems();
		return Promise.resolve(items.find((item) => item.id === itemId));
	}

	public async saveList(updatedList: List): Promise<any> {
		if (!updatedList.id) {
			updatedList.id = uuid();
		}
		// const lists: List[] = await this.getLists();
		// let listIndex = lists.findIndex((list) => list.id === updatedList.id);
		// let replace = 1;
		// if (listIndex === -1) {
		// 	listIndex = lists.length;
		// 	replace = 0;
		// }
		// lists.splice(listIndex, replace, updatedList);
		// return this.putLists(lists);
		return this.setList(updatedList);
	}

	public async saveItem(updatedItem: Item): Promise<any> {
		if (!updatedItem.id) {
			updatedItem.id = uuid();
		}
		// const items: Item[] = await this.getItems();
		// let itemIndex = items.findIndex((item) => item.id === updatedItem.id);
		// let replace = 1;
		// if (itemIndex === -1) {
		// 	itemIndex = items.length;
		// 	replace = 0;
		// }
		// items.splice(itemIndex, replace, updatedItem);
		return this.setItem(updatedItem);
	}

	public async deleteList(listId: string): Promise<List|undefined> {
		const lists: List[] = await this.getLists();
		const listIndex = lists.findIndex((list) => list.id === listId);
		const listToRemove = lists[listIndex];
		// const removedList = lists.splice(listIndex, 1).pop();
		// await this.putLists(lists);
		// return Promise.resolve(removedList);
		return gunUser.get('lists').unset(listToRemove).then();

	}

	public async deleteItem(itemId: string): Promise<Item|undefined> {
		const items: Item[] = await this.getItems();
		const itemIndex = items.findIndex((item) => item.id === itemId);
		const itemToRemove = items[itemIndex];
		// const removedItem = items.splice(itemIndex, 1).pop();
		// this.putItems(items);
		// return Promise.resolve(removedItem);
		return gunUser.get('items').unset(itemToRemove).then();
	}
}

export default new ListService();
