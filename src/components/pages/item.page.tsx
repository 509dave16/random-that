import { BaseComponent } from '../../common/classes/base.component';
import { Item } from '../../common/interfaces/item.interface';
import listService from '../../common/services/list.service';
import { PageComponent } from '../layout/page.component';

interface Props {
	history: any;
	match: any;
	location: any;
}
// tslint:disable-next-line
interface State { item: Item }

export default class ItemPage extends BaseComponent<Props, State> {
	public title: string;

	constructor(props) {
		super(props);
		this.state = { item: { id: '0', name: '', list_id: '0'} };
	}

	public async componentWillMount() {
		const { params } = this.props.match;
		const item = await listService.getItem(params.itemId) || { id: '0', list_id: params.listId, name: '' };
		this.title = item.name;
		this.setState({ item });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		if (!nextState.item) {
			return <div>Item is missing</div>;
		}
		return (
			<PageComponent history={this.props.history} headerOptions={{ title: this.title }}>
				<div class="field">
					<label class="label">Name</label>
					<div class="control">
						<input value={nextState.item.name} onInput={(e: Event) => this.handleStateInput('item.name', e) } class="input" type="text" placeholder="Text input" />
					</div>
				</div>
			</PageComponent>
		);
	}
}
