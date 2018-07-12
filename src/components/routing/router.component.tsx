import { Component } from 'inferno';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';
import AuthPage from '../pages/auth.page';
import ItemPage from '../pages/item.page';
import ListPage from '../pages/list.page';
import ListsPage from '../pages/lists.page';

export class RouterComponent extends Component {
	public render(nextProps: any, nextState: any, nextContext: any) {
		const routes = [
			<Route path="/lists/:listId/items/:itemId" component={ItemPage} />,
			<Route path="/lists/:listId" component={ListPage} />,
			<Route path="/lists" component={ListsPage} />,
			<Route path="/auth" component={AuthPage} />,
			<Redirect from="/" to="/lists" />
		];
		return (
			<BrowserRouter>
				<div>
					<Switch>
						{ routes }
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}
