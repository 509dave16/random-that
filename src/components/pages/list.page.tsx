import classNames from 'classnames';
import { BaseComponent } from '../../common/classes/base.component';
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
	creating: boolean;
	itemFormIsHidden: boolean;
	addItemIsHidden: boolean;
}

const emptyItem: Item = { id: '', list_id: '', name: ''};

export default class ListPage extends BaseComponent<Props, State> {
	constructor(props) {
		super(props);
		this.state = { items: [], list: { id: '0', name: ''}, newItem: { ...emptyItem } , itemFormIsHidden: true, addItemIsHidden: false, creating: false };
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

	public async createItem(state: State) {
		if (state.creating) {
			return; // don't perform again
		}
		const item: Item = state.newItem;
		item.id += Math.floor(Math.random() * 10000);
		item.list_id = state.list.id;
		this.setState({ creating: true });
		await listService.saveItem(item);
		const items: Item[] = state.items;
		this.toggleCreateItem(state);
		this.setState({ creating: false, items: [...items, item] });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		if (!nextState.list) {
			return <div>List is missing</div>;
		}
		const itemFormClassNames = classNames('m-t-sm', {'is-hidden': nextState.itemFormIsHidden});
		const addItemClassNames = classNames('m-t-sm', 'button', 'is-info', {'is-hidden': nextState.addItemIsHidden});
		const createItemClassNames = classNames('button', 'is-success', 'm-r-sm', { isLoading: nextState.creating });
		return (
			<PageComponent history={this.props.history} headerOptions={{ title: nextState.list.name }}>
				<div class="list">
					{
						nextState.items.map((item: Item) => {
							return (
								<div class="list-item ripple" onClick={(e: Event) => this.navigate(e, item.id)} ref={ (node) => this.onListItemRef(node)}>
									<div class="level">
										<div class="level-left">{item.name}</div>
										<div class="level-right">
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
				<a onClick={(e) => { this.toggleCreateItem(nextState); }} className={addItemClassNames}>
					<span class="icon">
						<ion-icon color="white" size="large" name="add"></ion-icon>
					</span>
					<span>Add Item</span>
				</a>
			</PageComponent>
		);
	}
}
