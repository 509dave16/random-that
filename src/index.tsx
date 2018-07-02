import { Component, render } from 'inferno';
import { BrowserRouter, Route, Switch } from 'inferno-router';
import ItemPage from './components/pages/item';
import ItemsPage from './components/pages/items';
import ListPage from './components/pages/list';
import ListsPage from './components/pages/lists';
import './main.sass';
const container = document.getElementById('app');

class MyComponent extends Component<any, any> {

	constructor(props, context) {
		super(props, context);
	}

	public render() {
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<Route path="/lists" component={ListsPage} />
						<Route path="/lists/:listId" component={ListPage} />
						<Route path="/lists/:listId/items" component={ItemsPage} />
						<Route path="/lists/:listId/items/:itemId" component={ItemPage} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

render(<MyComponent />, container);
