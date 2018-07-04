import { items, lists } from '../data/mocks';
import { Item } from '../interfaces/item.interface';
import { List } from '../interfaces/list.interface';

class ListService {
	public getLists() {
		return lists;
	}

	public getList(listId: string): List|undefined {
		return lists.find((list) => list.id === listId);
	}

	public getListItems(listId: string): Item[] {
		return items.filter((item) => item.list_id === listId);
	}

	public getItem(itemId: string): Item|undefined {
		return items.find((item) => item.id === itemId);
	}

	public saveList(updatedList: List): void {
		let listIndex = lists.findIndex((list) => list.id === updatedList.id);
		let replace = 1;
		if (listIndex === -1) {
			listIndex = lists.length;
			replace = 0;
		}
		lists.splice(listIndex, replace, updatedList);
	}

	public saveItem(updatedItem: Item): void {
		let itemIndex = items.findIndex((item) => item.id === updatedItem.id);
		let replace = 1;
		if (itemIndex === -1) {
			itemIndex = items.length;
			replace = 0;
		}
		items.splice(itemIndex, replace, updatedItem);
	}

	public deleteList(listId: string): void {
		const listIndex = lists.findIndex((list) => list.id === listId);
		lists.splice(listIndex, 1);
	}

	public deleteItem(itemId: string): void {
		const itemIndex = items.findIndex((item) => item.id === itemId);
		items.splice(itemIndex, 1);
	}
}

export default new ListService();
