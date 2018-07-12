import classNames from 'classnames';
import { BaseComponent } from '../../common/classes/base.component';
import { emptyList } from '../../common/data/mocks';
import { List } from '../../common/interfaces/list.interface';
import listService from '../../common/services/list.service';
import { toggleClassesOnHover, toggleClassesOnInteract } from '../../utils/css';
import { PageComponent } from '../layout/page.component';

interface Props {
	history: any;
}
// tslint:disable-next-line
interface State {
	lists: List[];
	newList: List;
	waiting: boolean;
	listFormIsHidden: boolean;
	addListIsHidden: boolean;
}

export default class ListsPage extends BaseComponent<Props, State> {
	constructor(props) {
		super(props);
		this.state = { lists: [], newList: { ...emptyList } , listFormIsHidden: true, addListIsHidden: false, waiting: false };
	}

	public onListRef = (node) => {
		toggleClassesOnInteract(node, ['has-text-white', 'has-background-primary']);
	}

	public onTrashRef = (node) => {
		toggleClassesOnHover(node, ['c-pointer']);
	}

	public navigate = (e: Event, listId: string) => {
		e.stopPropagation();
		this.props.history.push(`/lists/${listId}`);
	}

	public toggleCreateList(state: State) {
		const newState = this.toggleCreateListState(state);
		this.setState(newState);
	}

	public toggleCreateListState(state: State) {
		return { newList: { ...emptyList }, addListIsHidden: !state.addListIsHidden, listFormIsHidden: !state.listFormIsHidden };
	}

	public async clearLists() {
		await listService.clearLists();
	}

	public async createList(state: State) {
		if (state.waiting) {
			return; // don't perform again
		}
		const list: List = state.newList;
		this.setState({ waiting: true });
		await listService.saveList(list);
		const lists: List[] = state.lists;
		const newState = this.toggleCreateListState(state);
		this.setState({ ...newState, waiting: false, lists: [...lists, list] });
	}

	public async deleteList(e: Event, listId: string) {
		e.stopPropagation();
		const list: List|undefined = await listService.deleteList(listId);
		if (list) {
			const lists = await listService.getLists();
			console.log(lists);
			this.setState({ lists });
		}
	}

	public async componentWillMount() {
		const lists = await listService.getLists();
		this.setState({ lists });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		const listFormClassNames = classNames('m-t-sm', {'is-hidden': nextState.listFormIsHidden});
		const addListClassNames = classNames('is-flex-basis-100-mobile', 'm-t-sm', 'button', 'is-info', {'is-hidden': nextState.addListIsHidden});
		const createListClassNames = classNames('button', 'is-success', 'm-r-sm', { isLoading: nextState.waiting });

		return (
			<PageComponent history={this.props.history} headerOptions={{ back: false, title: 'Lists'}}>
				<div class="list">
					{
						nextState.lists.map((list) => {
							return (
								<div class="list-item ripple" onClick={(e: Event) => this.navigate(e, list.id)} ref={ (node) => this.onListRef(node)}>
									<div class="level">
										<div class="level-left">{list.name}</div>
										<div class="level-right">
											<a onClick={(e) => this.deleteList(e, list.id)} ref={(node) => this.onTrashRef(node) }><ion-icon color="danger" name="trash"></ion-icon></a>
											<ion-icon mode="ios" name="arrow-forward"></ion-icon>
										</div>
									</div>
								</div>
							);
						})
					}
				</div>
				<div className={listFormClassNames}>
					<div class="field">
						<p class="control has-icons-left">
							<input value={nextState.newList.name} onInput={(e: Event) => this.handleStateInput('newList.name', e)} class="input" type="text" placeholder="List Name" />
							<span class="icon is-small is-left">
								<ion-icon color="primary" name="list-box"></ion-icon>
							</span>
						</p>
					</div>
					<div style="display: flex; justify-content: center;">
						<button onClick={(e: Event) => this.createList(nextState) } className={createListClassNames}>Submit</button>
						<button onClick={ (e: Event) => this.toggleCreateList(nextState) }class="button is-danger">Cancel</button>
					</div>
				</div>
				<div class="is-flex">
					<a onClick={(e) => { this.toggleCreateList(nextState); }} className={addListClassNames}>
						<span class="icon">
							<ion-icon color="white" size="large" name="add"></ion-icon>
						</span>
						<span>Add List</span>
					</a>
					<a onClick={(e) => { this.clearLists(); }} className={addListClassNames}>
						<span>Clear Lists</span>
					</a>
				</div>
			</PageComponent>
		);
	}
}
