import { Component } from 'inferno';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';
import AuthPage from './pages/auth.page';
import ItemPage from './pages/item.page';
import ListPage from './pages/list.page';
import ListsPage from './pages/lists.page';
// import { PrivateRoute } from './components/routes/private.route';
import authService from '../common/services/auth.service';
const container = document.getElementById('app');

interface State {
	isAuthenticated: boolean;
	loading: boolean;
}

export class RouterComponent extends Component<{}, State> {
	constructor(props, context) {
		super(props, context);
		this.state = { isAuthenticated: true, loading: true };
	}

	public render(nextProps, nextState: State, nextContext: any) {
		const routes = [
			<Route path="/auth" component={AuthPage} />,
			<Route path="/lists/:listId/items/:itemId" component={ItemPage} />,
			<Route path="/lists/:listId" component={ListPage} />,
			<Route path="/lists" component={ListsPage} />,
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
