import { Component, render } from 'inferno';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';
import AuthPage from './components/pages/auth.page';
import ItemPage from './components/pages/item.page';
import ListPage from './components/pages/list.page';
import ListsPage from './components/pages/lists.page';
// import { PrivateRoute } from './components/routes/private.route';
import './main.sass';
import authService from './common/services/auth.service';
const container = document.getElementById('app');

interface State {
	isAuthenticated: boolean;
	loading: boolean;
	loggedIn: boolean;
}

class RootComponent extends Component<{}, State> {
	constructor(props, context) {
		super(props, context);
		this.state = { isAuthenticated: false, loading: true, loggedIn: false };
		authService.addOnLoggedInSubscriber(this.loggedIn);
	}

	public async componentWillMount() {
		console.log('here');
	 const isAuthenticated: boolean = await authService.isAuthenticatedAsync();
		if (isAuthenticated) {
			await authService.loadData();
		}
		this.setState({isAuthenticated, loading: false});
	}

	public loggedIn = () => {
		this.setState({ loggedIn: true });
	}

	public render(nextProps, nextState: State, nextContext: any) {
		console.log('here');
		if (nextState.loading) {
			return <div class="is-loading"></div>;
		}
		console.log('here');
		const routes = [
			<Route path="/auth" component={AuthPage} />,
			<Route path="/lists/:listId/items/:itemId" component={ItemPage} />,
			<Route path="/lists/:listId" component={ListPage} />,
			<Route path="/lists" component={ListsPage} />,
			<Redirect from="/" to="/lists" />
		];
		if (!nextState.isAuthenticated && !nextState.loggedIn) {
			console.log('redirecting');
			routes.splice(1, 0, <Redirect to="/auth" />);
		}
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

render(<RootComponent />, container);
