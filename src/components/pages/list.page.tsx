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
}

export default class ListPage extends BaseComponent<Props, State> {
	constructor(props) {
		super(props);
		this.state = { items: [], list: { id: '0', name: ''} };
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

	public render(nextProps: Props, nextState: State, nextContext: any) {
		if (!nextState.list) {
			return <div>List is missing</div>;
		}
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
			</PageComponent>
		);
	}
}
