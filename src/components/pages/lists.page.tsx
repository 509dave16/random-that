import { BaseComponent } from '../../common/classes/base.component';
import { List } from '../../common/interfaces/list.interface';
import listService from '../../common/services/list.service';
import { PageComponent } from '../../components/layout/page.component';
import { toggleClassesOnHover } from '../../utils/css';

interface Props {
	history: any;
}
// tslint:disable-next-line
interface State {
	lists: List[];
}

export default class ListsPage extends BaseComponent<Props, State> {
	constructor(props) {
		super(props);
		this.state = { lists: [] };
	}

	public onListRef = (node) => {
		toggleClassesOnHover(node, ['has-text-white', 'has-background-primary']);
	}

	public navigate = (e: Event, listId: string) => {
		this.props.history.push(`/lists/${listId}`);
	}

	public async componentWillMount() {
		const lists: List[] = await listService.getLists();
		this.setState({ lists });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
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
			</PageComponent>
		);
	}
}
