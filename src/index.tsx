import { Component, render } from 'inferno';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';
import AuthPage from './components/pages/auth.page';
import ItemPage from './components/pages/item.page';
import ListPage from './components/pages/list.page';
import ListsPage from './components/pages/lists.page';
import './main.sass';
const container = document.getElementById('app');

class MyComponent extends Component {
	constructor(props, context) {
		super(props, context);
	}

	public render() {
		const defaultPath = true ? '/auth' : '/lists';
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<Route path="/lists/:listId/items/:itemId" component={ItemPage} />
						<Route path="/lists/:listId" component={ListPage} />
						<Route path="/lists" component={ListsPage} />
						<Route path="/auth" component={AuthPage} />
						<Redirect from="/" to={defaultPath} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

render(<MyComponent />, container);
