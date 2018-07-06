import classNames from 'classnames';
import { BaseComponent } from '../../common/classes/base.component';
import { List } from '../../common/interfaces/list.interface';
import listService from '../../common/services/list.service';
import { toggleClassesOnHover } from '../../utils/css';
import { PageComponent } from '../layout/page.component';

interface Props {
	history: any;
}
// tslint:disable-next-line
interface State {
	lists: List[];
	newList: List;
	creating: boolean;
	listFormIsHidden: boolean;
	addListIsHidden: boolean;
}

const emptyList: List = { id: '', name: ''};

export default class ListsPage extends BaseComponent<Props, State> {
	constructor(props) {
		super(props);
		this.state = { lists: [], newList: { ...emptyList } , listFormIsHidden: true, addListIsHidden: false, creating: false };
	}

	public onListRef = (node) => {
		toggleClassesOnHover(node, ['has-text-white', 'has-background-primary']);
	}

	public navigate = (e: Event, listId: string) => {
		this.props.history.push(`/lists/${listId}`);
	}

	public toggleCreateList(state: State) {
		this.setState({ newList: { ...emptyList }, addListIsHidden: !state.addListIsHidden, listFormIsHidden: !state.listFormIsHidden });
	}

	public async createList(state: State) {
		if (state.creating) {
			return; // don't perform again
		}
		const list: List = state.newList;
		list.id += Math.floor(Math.random() * 10000);
		this.setState({ creating: true });
		await listService.saveList(list);
		const lists: List[] = state.lists;
		this.toggleCreateList(state);
		this.setState({ creating: false, lists: [...lists, list] });
	}

	public async componentWillMount() {
		const lists: List[] = await listService.getLists();
		this.setState({ lists });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		const listFormClassNames = classNames('m-t-sm', {'is-hidden': nextState.listFormIsHidden});
		const addListClassNames = classNames('m-t-sm', 'button', 'is-info', {'is-hidden': nextState.addListIsHidden});
		const createListClassNames = classNames('button', 'is-success', 'm-r-sm', { isLoading: nextState.creating });

		return (
			<PageComponent history={this.props.history} headerOptions={{ title: 'Lists'}}>
				<div class="list">
					{
						nextState.lists.map((list) => {
							return (
								<div class="list-item ripple" onClick={(e: Event) => this.navigate(e, list.id)} ref={ (node) => this.onListRef(node)}>
									<div class="level">
										<div class="level-left">{list.name}</div>
										<div class="level-right">
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
							<input onInput={(e: Event) => this.handleStateInput('newList.name', e)} class="input" type="text" placeholder="List Name" />
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
				<a onClick={(e) => { this.toggleCreateList(nextState); }} className={addListClassNames}>
					<span class="icon">
						<ion-icon color="white" size="large" name="add"></ion-icon>
					</span>
					<span>Add List</span>
				</a>
			</PageComponent>
		);
	}
}
