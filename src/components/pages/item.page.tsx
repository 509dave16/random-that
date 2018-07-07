import classNames from 'classnames';
import { BaseComponent } from '../../common/classes/base.component';
import { emptyItem } from '../../common/data/mocks';
import { Item } from '../../common/interfaces/item.interface';
import listService from '../../common/services/list.service';
import { PageComponent } from '../layout/page.component';

interface Props {
	history: any;
	match: any;
	location: any;
}
// tslint:disable-next-line
interface State { item: Item, updating: boolean, title: string }

export default class ItemPage extends BaseComponent<Props, State> {

	constructor(props) {
		super(props);
		this.state = { item: { ...emptyItem }, updating: false, title: '' };
	}

	public async componentWillMount() {
		const { params } = this.props.match;
		const item = await listService.getItem(params.itemId) || { ...emptyItem };
		this.setState({ item, title: item.name });
	}

	public async updateItem(state: State) {
		if (state.updating) {
			return; // don't perform again
		}
		const item: Item = state.item;
		this.setState({ updating: true });
		await listService.saveItem(item);
		this.setState({ updating: false, item: {... item}, title: item.name });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		if (!nextState.item) {
			return <div>Item is missing</div>;
		}
		const updateItemClassNames = classNames('m-t-sm', 'button', 'is-success', 'is-flex-basis-100-mobile');
		return (
			<PageComponent history={this.props.history} headerOptions={{ title: nextState.title }}>
				<div class="field">
					<label class="label">Name</label>
					<div class="control">
						<input value={nextState.item.name} onInput={(e: Event) => this.handleStateInput('item.name', e) } class="input" type="text" placeholder="Text input" />
					</div>
				</div>
				<div class="is-flex">
					<a onClick={(e) => { this.updateItem(nextState); }} className={updateItemClassNames}>
						<span class="icon">
							<ion-icon color="white" size="large" name="save"></ion-icon>
						</span>
						<span>Update</span>
					</a>
				</div>
			</PageComponent>
		);
	}
}
