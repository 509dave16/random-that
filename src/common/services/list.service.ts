import { items, lists } from '../data/mocks';
import { Item } from '../interfaces/item.interface';
import { List } from '../interfaces/list.interface';

class ListService {
	public getLists() {
		return lists;
	}

	public getList(listId: string): Promise<List|undefined> {
		return Promise.resolve(lists.find((list) => list.id === listId));
	}

	public getListItems(listId: string): Promise<Item[]> {
		return Promise.resolve(items.filter((item) => item.list_id === listId));
	}

	public getItem(itemId: string): Promise<Item|undefined> {
		return Promise.resolve(items.find((item) => item.id === itemId));
	}

	public saveList(updatedList: List): Promise<any> {
		let listIndex = lists.findIndex((list) => list.id === updatedList.id);
		let replace = 1;
		if (listIndex === -1) {
			listIndex = lists.length;
			replace = 0;
		}
		lists.splice(listIndex, replace, updatedList);
		return Promise.resolve(true);
	}

	public saveItem(updatedItem: Item): Promise<any> {
		let itemIndex = items.findIndex((item) => item.id === updatedItem.id);
		let replace = 1;
		if (itemIndex === -1) {
			itemIndex = items.length;
			replace = 0;
		}
		items.splice(itemIndex, replace, updatedItem);
		return Promise.resolve(true);
	}

	public deleteList(listId: string): Promise<any> {
		const listIndex = lists.findIndex((list) => list.id === listId);
		lists.splice(listIndex, 1);
		return Promise.resolve(true);
	}

	public deleteItem(itemId: string): Promise<any> {
		const itemIndex = items.findIndex((item) => item.id === itemId);
		items.splice(itemIndex, 1);
		return Promise.resolve(true);
	}
}

export default new ListService();
