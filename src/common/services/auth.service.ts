import { Profile } from '../../components/pages/auth.page';
import { gunUser } from './gun.service';
export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';
const ACTION_CREATE = 'create';
const ACTION_AUTH = 'auth';
const AUTH_SESSION_KEY = 'authenticated';

export interface FriendlyResponse {
	status: string;
	message: string;
	data?: any;
}

class AuthService {
	private referrer: string = '/';
	private dataLoaded: boolean = false;
	private onLoggedInSubscibers: Function[] = [];
	public addOnLoggedInSubscriber(onLoggedIn: Function) {
		this.onLoggedInSubscibers.push(onLoggedIn);
	}
	private notifyOnLoggedInSubscribers() {
		this.onLoggedInSubscibers.forEach((subscriber) => {
			subscriber();
		});
	}
	public async isAuthenticatedAsync(): Promise<boolean> {
		console.log(gunUser.is);
		// 1. First check if session is alive
		try {
			await gunUser.alive();
			return Promise.resolve(true);
		} catch (e) {
			console.log(e);
		}
		// 2. Check if auth credentials were stored
		const profileStr: string|null = sessionStorage.getItem(AUTH_SESSION_KEY);
		if (!profileStr) {
			return Promise.resolve(false);
		}
		// 3. Check if they are correct
		const profileParts = profileStr.split(':');
		const profile: Profile = { username: profileParts[0], password: profileParts[1]};
		try {
			await this.login(profile);
			return Promise.resolve(true);
		} catch (e) {
			console.log(e);
			await this.logout();
		}
		// 4. If all else fails then we're doomed
		return Promise.resolve(false);
	}

	public async loadData(): Promise<any> {
		if (this.dataLoaded) {
			return Promise.resolve(true);
		}
		this.dataLoaded = true;
		const lists = await gunUser.get('lists').load().then();
		if (!lists) {
			await gunUser.get('lists').put({}).then();
		}
		const items = await gunUser.get('items').load().then();
		if (!items) {
			await gunUser.get('items').put({}).then();
		}
		return Promise.resolve(true);
	}

	public isAuthenticated(): boolean {
		const profileStr: string|null = sessionStorage.getItem(AUTH_SESSION_KEY);
		return profileStr !== null;
	}

	private setAuthenticated(profile: string) {
		if (profile) {
			sessionStorage.setItem(AUTH_SESSION_KEY, profile);
		} else {
			sessionStorage.removeItem(AUTH_SESSION_KEY);
		}
	}

	public setReferrer(referrer: string) {
		this.referrer = referrer;
	}

	public getReferrer(): string {
		return this.referrer;
	}

	public login(profile: Profile): Promise<FriendlyResponse> {
		return this.auth(profile, ACTION_AUTH, 'loggedin').then((resp) => {
			this.notifyOnLoggedInSubscribers();
			return resp;
		});
	}

	public register(profile: Profile): Promise<FriendlyResponse> {
		return this.auth(profile, ACTION_CREATE, 'registered');
	}

	private auth(profile: Profile, action: string, message: string): Promise<FriendlyResponse> {
		return new Promise((resolve, reject) => {
			gunUser[action](profile.username, profile.password, (ack) => {
				if (ack.err || ack.status === 'error') {
					reject({ status: STATUS_ERROR, message: ack.err || ack.message});
				} else {
					this.setAuthenticated(`${profile.username}:${profile.password}`);
					resolve({ status: STATUS_SUCCESS, message });
				}
			});
		});
	}

	public async logout() {
		const result = await gunUser.leave();
		console.log(result);
		this.setAuthenticated('');
		this.dataLoaded = false;
	}
}

export default new AuthService();
