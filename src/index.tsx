import { Component, render } from 'inferno';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';
import AuthPage from './components/pages/auth.page';
import ItemPage from './components/pages/item.page';
import ListPage from './components/pages/list.page';
import ListsPage from './components/pages/lists.page';
import { PrivateRoute } from './components/routes/private.route';
import './main.sass';
const container = document.getElementById('app');

class MyComponent extends Component {
	constructor(props, context) {
		super(props, context);
	}

	public render() {
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<PrivateRoute path="/lists/:listId/items/:itemId" component={ItemPage} />
						<PrivateRoute path="/lists/:listId" component={ListPage} />
						<PrivateRoute path="/lists" component={ListsPage} />
						<Route path="/auth" component={AuthPage} />
						<Redirect from="/" to="/lists" />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

render(<MyComponent />, container);
