import { Component, render } from 'inferno';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';
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
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<Route path="/lists/:listId/items/:itemId" component={ItemPage} />
						<Route path="/lists/:listId" component={ListPage} />
						<Route path="/lists" component={ListsPage} />
						<Redirect from="/" to="/lists" />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

render(<MyComponent />, container);
