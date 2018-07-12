import classNames from 'classnames';
import { BaseComponent } from '../../common/classes/base.component';
import { default as authService, FriendlyResponse, STATUS_SUCCESS, Credentials } from '../../common/services/auth.service';
import { PageComponent } from '../layout/page.component';

interface Props {
	history: any;
	match: any;
	location: any;
}
// tslint:disable-next-line
interface State { credentials: Credentials, updating: boolean, action: string, error: string }

const ACTION_LOGIN = 'login';
const ACTION_REGISTER = 'register';
const emptyCredentials: Credentials = { username: '', password: '' };

export default class AuthPage extends BaseComponent<Props, State> {

	constructor(props) {
		super(props);
		this.state = { credentials: { ...emptyCredentials }, updating: false, action: ACTION_LOGIN, error: ''};
	}

	public async handleAuth(state: State) {
		if (state.updating) {
			return;
		}
		let credentials: Credentials = state.credentials;
		let error: string = '';
		try {
			const response: FriendlyResponse = await authService[state.action](credentials);
			if (response.status === STATUS_SUCCESS) {
				this.props.history.push(authService.getReferer());
			}
		} catch (e) {
			error = e.message || 'Error thrown';
			credentials = { ...emptyCredentials };
		}
		this.setState({ updating: false, credentials, error });
	}

	public closeError = () => {
		this.setState({ error: ''});
	}

	public setAction(action: string) {
		this.setState({ action });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		const submitClassNames = classNames('m-t-sm', 'button', 'is-success', 'is-flex-basis-100-mobile');
		const errorClassNames = classNames('notification is-danger', {'is-hidden': !nextState.error });
		return (
			<PageComponent history={this.props.history} headerOptions={{ title: nextState.action, back: false, menu: false, breadcrumbs: false, auth: false }}>
				<div className={errorClassNames}>
					<button onClick={this.closeError} class="delete"></button>
					{nextState.error}
				</div>
				<nav class="panel">
					<p class="panel-tabs">
						<a onClick={(e) => this.setAction(ACTION_LOGIN)}class={nextState.action === ACTION_LOGIN ? 'is-active' : ''}>Login</a>
						<a onClick={(e) => this.setAction(ACTION_REGISTER)} class={nextState.action === ACTION_REGISTER ? 'is-active' : ''}>Register</a>
					</p>
					<div class="field panel-block">
						<label class="m-r-sm">Username</label>
						<div class="control">
							<input value={nextState.credentials.username} onInput={(e: Event) => this.handleStateInput('credentials.username', e) } class="input" type="text" placeholder="Username" />
						</div>
					</div>
					<div class="field panel-block">
						<label class="m-r-sm">Password</label>
						<div class="control">
							<input value={nextState.credentials.password} onInput={(e: Event) => this.handleStateInput('credentials.password', e) } class="input" type="password" placeholder="Password" />
						</div>
					</div>
					<div class="is-flex">
						<a onClick={(e) => { this.handleAuth(nextState); }} className={submitClassNames}>
							<span class="is-capitalized">{nextState.action}</span>
						</a>
					</div>
				</nav>
			</PageComponent>
		);
	}
}
