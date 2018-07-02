import { Component } from 'inferno';
import listService from '../../common/services/list.service';
import { toggleClassesOnHover } from '../../utils/css';

export default class ListsPage extends Component {

	public onListItemRef = (node) => {
		toggleClassesOnHover(node, ['has-text-white', 'has-background-primary']);
	}

	public navigate = (e: Event, listId: string) => {
		// this.props.history.push()
	}

	public render() {
		return (
			<section class="section">
				<div class="container">
					<h1 class="title">Lists</h1>
					<div class="list">
						{listService.getLists().map((list) => {
							return (
								<div class="list-item ripple" tabIndex={0} onClick={(e: Event) => this.navigate(e, list.id)} ref={ (node) => this.onListItemRef(node)}>
									<div class="level">
										<div class="level-left">{list.name}</div>
										<div class="level-right">
											<ion-icon mode="ios" name="arrow-forward"></ion-icon>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>
		);
	}
}
