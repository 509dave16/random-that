// import { items, lists } from '../data/mocks';
import { Item } from '../interfaces/item.interface';
import { List } from '../interfaces/list.interface';
import { gunUser } from './gun.service';
import uuid from 'uuid/v4';

class ListService {
	public async getLists(): Promise<List[]> {
		return this.getCollectionNodeData('lists');
	}

	public async getListsNode(): Promise<any> {
		return this.getCollectionNode('lists');
	}

	public async getList(listId: string): Promise<List|undefined> {
		const { node } = await this.getListsNode();
		const list = await node.get(listId).load().then();
		return list;
	}

	public async getItems(): Promise<Item[]> {
		return this.getCollectionNodeData('items');
	}

	public async getItemsNode(): Promise<any> {
		return this.getCollectionNode('items');
	}

	public async clearLists(): Promise<any> {
		const { node } = await this.getListsNode();
		return node.put(null).then();
	}

	public async getListItems(listId: string): Promise<Item[]> {
		const items: Item[] = await this.getItems();
		return items.filter((item) => item.list_id === listId);
	}

	public async getItem(itemId: string): Promise<Item|undefined> {
		const { node } = await this.getItemsNode();
		const item = await node.get(itemId).load().then();
		return item;
	}

	public async saveList(updatedList: List): Promise<any> {
		if (!updatedList.id) {
			updatedList.id = uuid();
		}
		const { node } = await this.getListsNode();
		await node.get(updatedList.id).put(updatedList).then();
		return updatedList;
	}

	public async saveItem(updatedItem: Item): Promise<any> {
		if (!updatedItem.id) {
			updatedItem.id = uuid();
		}
		const { node } = await this.getItemsNode();
		await node.get(updatedItem.id).put(updatedItem).then();
	}

	public async deleteList(listId: string): Promise<any> {
		const { node } = await this.getListsNode();
		return node.get(listId).put(null).then();
	}

	public async deleteItem(itemId: string): Promise<Item> {
		const { node } = await this.getItemsNode();
		return node.get(itemId).put(null).then();
	}

	private getNode(path: string, at?: any): any {
		let node = gunUser.get(path);
		if (at) {
			node = at.get(path);
		}
		return { node };
	}

	private async isNodeSet(path: string, at?: any): Promise<boolean> {
		let nodeObj = this.getNode(path);
		if (at) {
			nodeObj = this.getNode(path, at);
		}
		const { node } = nodeObj;
		try {
			const result = await node.load().promise();
			return result.put !== undefined;
		} catch (e) {
			console.log(e);
		}

		return false;
	}

	private async initCollectionNodeMetadata(path): Promise<any> {
		const nodeObj = this.getNode(path);
		const { node } = nodeObj;
		return node.put({ metadata : { type: 'collection'}}).then();
	}

	private async getCollectionNodeData(path): Promise<any[]> {
		const { node } = await this.getCollectionNode(path);
		const collection: any[] = [];
		const indexes = await node.then();
		for (const index in indexes) {
			if (index === '_' || index === 'metadata') {
				continue;
			}
			const data = await node.get(index).load().promise();
			collection.push(data.put);
		}
		return collection;
	}

	private async getCollectionNode(path): Promise<any> {
		const nodeInitialized = await this.isNodeSet(path);
		if (nodeInitialized) {
			await this.initCollectionNodeMetadata(path);
		}
		return this.getNode(path);
	}
}

export default new ListService();
