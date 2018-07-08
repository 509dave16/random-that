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

	public async isAuthenticatedAsync(): Promise<boolean> {
		const profileStr: string|null = sessionStorage.getItem(AUTH_SESSION_KEY);
		if (!profileStr) {
			return Promise.resolve(false);
		}
		const profileParts = profileStr.split(':');
		const profile: Profile = { username: profileParts[0], password: profileParts[1]};
		try {
			await this.login(profile);
			return Promise.resolve(true);
		} catch (e) {
			return Promise.resolve(false);
		}
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
		return this.auth(profile, ACTION_AUTH, 'loggedin');
	}

	public register(profile: Profile): Promise<FriendlyResponse> {
		return this.auth(profile, ACTION_CREATE, 'registered');
	}

	private auth(profile: Profile, action: string, message: string): Promise<FriendlyResponse> {
		return new Promise((resolve, reject) => {
			gunUser[action](profile.username, profile.password, (ack) => {
				console.log(ack);
				if (ack.err) {
					reject({ status: STATUS_ERROR, message: ack.err});
				} else {
					this.setAuthenticated(`${profile.username}:${profile.password}`);
					resolve({ status: STATUS_SUCCESS, message });
				}
			});
		});
	}

	public logout() {
		this.setAuthenticated('');
	}
}

export default new AuthService();
