import { items, lists } from '../data/mocks';
import { Item } from '../interfaces/item.interface';
import { List } from '../interfaces/list.interface';

class ListService {
	public getLists() {
		return lists;
	}

	public getList(listId: string) {
		return lists.find((list) => list.id === listId);
	}

	public getListItems(listId: string) {
		return items.filter((item) => item.list_id === listId);
	}

	public getItem(itemId: string) {
		return items.find((item) => item.id === itemId);
	}

	public saveList(updatedList: List) {
		let listIndex = lists.findIndex((list) => list.id === updatedList.id);
		let replace = 1;
		if (listIndex === -1) {
			listIndex = lists.length;
			replace = 0;
		}
		lists.splice(listIndex, replace, updatedList);
	}

	public saveItem(updatedItem: Item) {
		let itemIndex = items.findIndex((item) => item.id === updatedItem.id);
		let replace = 1;
		if (itemIndex === -1) {
			itemIndex = items.length;
			replace = 0;
		}
		items.splice(itemIndex, replace, updatedItem);
	}

	public deleteList(listId: string) {
		const listIndex = lists.findIndex((list) => list.id === listId);
		lists.splice(listIndex, 1);
	}

	public deleteItem(itemId: string) {
		const itemIndex = items.findIndex((item) => item.id === itemId);
		items.splice(itemIndex, 1);
	}
}

export default new ListService();
