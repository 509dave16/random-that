import { BaseComponent } from '../../common/classes/base.component';
import { Item } from '../../common/interfaces/item.interface';
import { List } from '../../common/interfaces/list.interface';
import listService from '../../common/services/list.service';
import { PageComponent } from '../../components/layout/page.component';
import { toggleClassesOnHover } from '../../utils/css';

interface Props {
	history: any;
	match: any;
	location: any;
}
// tslint:disable-next-line
interface State {}

export default class ListPage extends BaseComponent<Props, State> {

	public onListItemRef = (node) => {
		toggleClassesOnHover(node, ['has-text-white', 'has-background-primary']);
	}

	public navigate = (e: Event, listItemId: string) => {
		const { params } = this.props.match;
		this.props.history.push(`/lists/${params.listId}/items/${listItemId}`);
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		const { params } = this.props.match;
		const list: List|undefined = listService.getList(params.listId);
		if (!list) {
			return <div>List is missing</div>;
		}
		return (
			<PageComponent history={this.props.history} headerOptions={{ title: list.name }}>
				<div class="list">
					{
						listService.getListItems(list.id).map((item: Item) => {
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
