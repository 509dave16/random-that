import { Component } from 'inferno';
import { Redirect, Route } from 'inferno-router';
import authService from '../../common/services/auth.service';

export class PrivateRoute extends Component<any, any> {
	constructor(props) {
		super(props);
		this.state = { isAuthenticated: authService.isAuthenticated(), loading: true };
	}
	public async componentWillMount(): Promise<any> {
		// const isAuthenticated = await authService.isAuthenticatedAsync();
		// this.setState({ isAuthenticated, loading: false });
		this.setState({ loading: false });
	}
	public render({ component, ...rest }, nextState, nextContext: any) {
		const TargetComponent = component;
		if (!nextState.isAuthenticated) {
			authService.setReferrer(rest.path);
		}
		return (
			<Route
				{...rest}
				render={(props) =>
					nextState.isAuthenticated ? (
						<TargetComponent {...props} />
					) : (
						<Redirect to="/auth" />
					)
				}
			/>
		);
	}
}
