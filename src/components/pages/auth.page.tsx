import classNames from 'classnames';
import { Redirect } from 'inferno-router';
import { BaseComponent } from '../../common/classes/base.component';
import { default as authService, FriendlyResponse, STATUS_SUCCESS } from '../../common/services/auth.service';
import { PageComponent } from '../layout/page.component';

export interface Profile {
	username: string;
	password: string;
}

interface Props {
	history: any;
	match: any;
	location: any;
}
// tslint:disable-next-line
interface State { profile: Profile, updating: boolean, action: string, redirectToReferrer: boolean, error: string }

const ACTION_LOGIN = 'login';
const ACTION_REGISTER = 'register';
const emptyProfile: Profile = { username: '', password: '' };

export default class AuthPage extends BaseComponent<Props, State> {

	constructor(props) {
		super(props);
		this.state = { profile: { ...emptyProfile }, updating: false, action: ACTION_LOGIN, redirectToReferrer: false, error: ''};
	}

	public async handleAuth(state: State) {
		if (state.updating) {
			return;
		}
		let profile: Profile = state.profile;
		let error: string = '';
		try {
			const response: FriendlyResponse = await authService[state.action](profile);
			if (response.status === STATUS_SUCCESS) {
				this.setState({ redirectToReferrer: true });
				this.props.history.push('/lists');
			}
		} catch (e) {
			error = e.message || 'Error thrown';
			profile = { ...emptyProfile };
		}
		this.setState({ updating: false, profile, error });
	}

	public closeError = () => {
		this.setState({ error: ''});
	}

	public setAction(action: string) {
		this.setState({ action });
	}

	public render(nextProps: Props, nextState: State, nextContext: any) {
		const from = nextProps.location.from || '/';
		const { redirectToReferrer } = nextState;

		if (redirectToReferrer) {
			return <Redirect to={from} />;
		}
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
							<input value={nextState.profile.username} onInput={(e: Event) => this.handleStateInput('profile.username', e) } class="input" type="text" placeholder="Username" />
						</div>
					</div>
					<div class="field panel-block">
						<label class="m-r-sm">Password</label>
						<div class="control">
							<input value={nextState.profile.password} onInput={(e: Event) => this.handleStateInput('profile.password', e) } class="input" type="password" placeholder="Password" />
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
