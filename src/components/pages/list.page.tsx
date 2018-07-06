import classNames from 'classnames';
import { BaseComponent } from '../../common/classes/base.component';
import { emptyItem } from '../../common/data/mocks';
import { Item } from '../../common/interfaces/item.interface';
import { List } from '../../common/interfaces/list.interface';
import listService from '../../common/services/list.service';
import { toggleClassesOnHover } from '../../utils/css';
import { PageComponent } from '../layout/page.component';

interface Props {
	history: any;
	match: any;
	location: any;
}
// tslint:disable-next-line
interface State {
	list: List;
	items: Item[];
	newItem: Item;
	waiting: boolean;
	randomItem: Item;
	itemFormIsHidden: boolean;
	addItemIsHidden: boolean;
}

export default class ListPage extends BaseComponent<Props, State> {
	public randomThatModal: HTMLElement;

	constructor(props) {
		super(props);
		this.state = { randomItem: { ...emptyItem }, items: [], list: { id: '0', name: ''}, newItem: { ...emptyItem } , itemFormIsHidden: true, addItemIsHidden: false, waiting: false };
	}

	public async componentWillMount() {
		const { params } = this.props.match;
		const list: List|undefined = await listService.getList(params.listId);
		if (!list) {
			return;
		}
		const items: Item[] = await listService.getListItems(list.id);
		this.setState({ items, list });
	}

	public onListItemRef = (node) => {
		toggleClassesOnHover(node, ['has-text-white', 'has-background-primary']);
	}

	public navigate = (e: Event, listItemId: string) => {
		const { params } = this.props.match;
		this.props.history.push(`/lists/${params.listId}/items/${listItemId}`);
	}

	public toggleCreateItem(state: State) {
		this.setState({ newItem: { ...emptyItem }, addItemIsHidden: !state.addItemIsHidden, itemFormIsHidden: !state.itemFormIsHidden });
	}

	public randomThat(state: State) {
		this.randomItem(state);
		this.toggleRandomThatModal();
	}

	public nextRandomThat(state: State) {
		this.randomItem(state);
	}

	public randomItem(state: State) {
		if (state.items.length === 0) {
			return;
		}
		const incompleteItems: Item[] = state.items.filter((item) => !item.done);
		let randomItem: Item;
		if (incompleteItems.length === 0) {
			const updatedItems = state.items.map((item) => { item.done = false; return item; });
			this.setState({ items: updatedItems });
			randomItem = updatedItems[this.randomNumber(updatedItems.length)];
		} else {
			randomItem = incompleteItems[this.randomNumber(incompleteItems.length)];
		}
		this.setState({ randomItem });
	}

	public confirmRandomItem(state) {
		state.randomItem.done = true;
		const items = state.items.map((item) => ({ ...item }));
		this.setState({ items, randomItem: { ...emptyItem }});
		this.toggleRandomThatModal();
	}

	public cancelRandomItem(state) {
		this.setState({ randomItem: { ...emptyItem} });
		this.toggleRandomThatModal();
	}

	public randomNumber(max): number {
		return Math.floor(Math.random() * max);
	}

	public randomThatModalReference(node: any) {
		this.randomThatModal = node;
	}

	public toggleRandomThatModal() {
		this.randomThatModal.classList.toggle('is-active');
	}

	public getItemClasses(item: Item) {
		return classNames({ 'is-invisible': !item.done });
	}

	public async createItem(state: State) {
		if (state.waiting) {
			return; // don't perform again
		}
		const item: Item = state.newItem;
		item.id += Math.floor(Math.random() * 10000);
		item.list_id = state.list.id;
		this.setState({ waiting: true });
		await listService.saveItem(item);
		const items: Item[] = state.items;
		this.toggleCreateItem(state);
		this.setState({ waiting: false, items: [...items, item] });
	}

	public async deleteItem(e: Event, itemId: string) {
		e.stopPropagation();
		const item: Item|undefined = await listService.deleteItem(itemId);
		if (item) {
			const items = await listService.getListItems(item.list_id);
			this.setState({ items });
		}
	}

	public onTrashRef = (node) => {
		toggleClassesOnHover(node, ['c-pointer']);
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		if (!nextState.list) {
			return <div>List is missing</div>;
		}
		const itemFormClassNames = classNames('m-t-sm', {'is-hidden': nextState.itemFormIsHidden});
		const addItemClassNames = classNames('m-t-sm', 'button', 'is-info', {'is-hidden': nextState.addItemIsHidden});
		const createItemClassNames = classNames('button', 'is-success', 'm-r-sm', { isLoading: nextState.waiting });
		const confirmRandomItemClassNames = classNames('button', 'is-success', 'm-r-sm', { isLoading: nextState.waiting });
		const skipRandomItemClassNames = classNames('button', 'is-info', 'm-r-sm', { isLoading: nextState.waiting });
		const cancelRandomItemClassNames = classNames('button', 'is-danger', { isLoading: nextState.waiting });

		return (
			<PageComponent history={this.props.history} headerOptions={{ title: nextState.list.name }}>
				<div class="list">
					{
						nextState.items.map((item: Item) => {
							return (
								<div class="list-item ripple" onClick={(e: Event) => this.navigate(e, item.id)} ref={ (node) => this.onListItemRef(node)}>
									<div class="level">
										<div class="level-left"><span className={this.getItemClasses(item)}><ion-icon color="success" name="checkbox"></ion-icon></span>{item.name}</div>
										<div class="level-right">
											<a onClick={(e) => this.deleteItem(e, item.id)} ref={(node) => this.onTrashRef(node) }><ion-icon name="trash" color="danger"></ion-icon></a>
											<ion-icon mode="ios" name="arrow-forward"></ion-icon>
										</div>
									</div>
								</div>
							);
						})
					}
				</div>
				<div className={itemFormClassNames}>
					<div class="field">
						<p class="control has-icons-left">
							<input value={nextState.newItem.name} onInput={(e: Event) => this.handleStateInput('newItem.name', e)} class="input" type="text" placeholder="Item Name" />
							<span class="icon is-small is-left">
								<ion-icon color="primary" name="list-box"></ion-icon>
							</span>
						</p>
					</div>
					<div style="display: flex; justify-content: center;">
						<button onClick={(e: Event) => this.createItem(nextState) } className={createItemClassNames}>Submit</button>
						<button onClick={ (e: Event) => this.toggleCreateItem(nextState) }class="button is-danger">Cancel</button>
					</div>
				</div>
				<div class="level">
					<div class="level-right">
						<a onClick={(e) => { this.toggleCreateItem(nextState); }} className={addItemClassNames}>
							<span class="icon">
								<ion-icon color="white" size="large" name="add"></ion-icon>
							</span>
							<span>Add Item</span>
						</a>
					</div>
					<div class="level-left">
						<a onClick={(e) => { this.randomThat(nextState); }} className={addItemClassNames}>
							<span class="icon">
								<ion-icon size="large" color="white" name="shuffle"></ion-icon>
							</span>
							<span>Random That</span>
						</a>
					</div>
				</div>
				<div ref={(node) => this.randomThatModalReference(node) } class="modal">
					<div class="modal-background"></div>
					<div class="modal-content">
					<article class="message">
						<div class="message-header">
							<p>Random {nextState.list.name}</p>
							<button class="delete" aria-label="delete"></button>
						</div>
						<div class="message-body">
						<h4>{ nextState.randomItem.name }</h4>
							<div style="display: flex; justify-content: center;">
								<button onClick={(e: Event) => this.confirmRandomItem(nextState) } className={confirmRandomItemClassNames}>Submit</button>
								<button onClick={(e: Event) => this.nextRandomThat(nextState) } className={skipRandomItemClassNames}>Skip</button>
								<button onClick={ (e: Event) => this.cancelRandomItem(nextState) }className={cancelRandomItemClassNames}>Cancel</button>
							</div>
						</div>
						</article>
					</div>
					<button onClick={ (e: Event) => this.cancelRandomItem(nextState) } class="modal-close is-large" aria-label="close"></button>
				</div>
			</PageComponent>
		);
	}
}
