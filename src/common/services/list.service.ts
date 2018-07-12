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
		const listsNode = await this.getListsNode();
		const list = await listsNode.get(listId).load();
		return list;
	}

	public async getItems(): Promise<Item[]> {
		return this.getCollectionNodeData('items');
	}

	public async getItemsNode(): Promise<any> {
		return this.getCollectionNode('items');
	}

	public async clearLists(): Promise<any> {
		const listsNode = await this.getListsNode();
		return listsNode.put(null).then();
	}

	public async getListItems(listId: string): Promise<Item[]> {
		const items: Item[] = await this.getItems();
		return Promise.resolve(items.filter((item) => item.list_id === listId));
	}

	public async getItem(itemId: string): Promise<Item|undefined> {
		const itemsNode = await this.getItemsNode();
		const item = await itemsNode.get(itemId).load().then();
		return item;
	}

	public async saveList(updatedList: List): Promise<any> {
		if (!updatedList.id) {
			updatedList.id = uuid();
		}
		const listsNode = await this.getListsNode();
		await listsNode.get(updatedList.id).put(updatedList).then();
		return updatedList;
	}

	public async saveItem(updatedItem: Item): Promise<any> {
		if (!updatedItem.id) {
			updatedItem.id = uuid();
		}
		const itemsNode = await this.getItemsNode();
		await itemsNode.get(updatedItem.id).put(updatedItem).then();
	}

	public async deleteList(listId: string): Promise<any> {
		const listsNode = await this.getListsNode();
		return listsNode.get(listId).put(null).then();
	}

	public async deleteItem(itemId: string): Promise<Item> {
		const itemsNode = await this.getItemsNode();
		return itemsNode.get(itemId).put(null).then();
	}

	private getNode(path: string, at?: any): any {
		if (at) {
			return at.get(path);
		}
		return gunUser.get(path);
	}

	private async isNodeSet(path: string, at?: any): Promise<boolean> {
		let node = this.getNode(path);
		if (at) {
			node = this.getNode(path, at);
		}
		const keys = await node.once().then();
		return keys === undefined;
	}

	private async initCollectionNodeMetadata(path): Promise<any> {
		const node = this.getNode(path);
		return node.put({ metadata : { type: 'collection'}}).then();
	}

	private async getCollectionNodeData(path): Promise<any[]> {
		const collectionNode = await this.getCollectionNode(path);
		const nodeData = collectionNode.load().then();
		const collection: any[] = [];
		for (const index in nodeData) {
			if (index === '_' || index === 'metadata') {
				continue;
			}
			collection.push(nodeData[index]);
		}
		return collection;
	}

	private async getCollectionNode(path): Promise<any> {
		const nodeIniitalized = await this.isNodeSet(path);
		if (!nodeIniitalized) {
			await this.initCollectionNodeMetadata(path);
		}
		return this.getNode(path);
	}
}

export default new ListService();
