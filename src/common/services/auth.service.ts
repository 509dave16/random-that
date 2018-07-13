import { gun, gunUser } from './gun.service';
export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';
const ACTION_CREATE = 'create';
const ACTION_AUTH = 'auth';
const SESSION_KEY_USERNAME = 'rt_username';
const SESSION_KEY_PASSWORD = 'rt_password';

export interface Credentials {
	username: string;
	password: string;
}

export interface FriendlyResponse {
	status: string;
	message: string;
	data?: any;
}

class AuthService {
	private referer: string = '';

	public async isAuthenticated(): Promise<FriendlyResponse> {
		const credentials: Credentials|null = this.getCredentials();
		const errorResponse: FriendlyResponse =  { status: STATUS_ERROR, message: 'please login'};
		if (!credentials) {
			return errorResponse;
		}
		try {
			const response = await this.login(credentials);
			return response;
		} catch (e) {
			this.unsetCredentials();
		}
		return errorResponse;
	}

	public async login(credentials: Credentials): Promise<FriendlyResponse> {
		const response = await this.auth(credentials, ACTION_AUTH, 'loggedin');
		return response;
	}

	public register(credentials: Credentials): Promise<FriendlyResponse> {
		return this.auth(credentials, ACTION_CREATE, 'registered');
	}

	private auth(credentials: Credentials, action: string, message: string): Promise<FriendlyResponse> {
		return new Promise((resolve, reject) => {
			gun.user()[action](credentials.username, credentials.password, (ack) => {
				if (ack.err || ack.status === 'error') {
					reject({ status: STATUS_ERROR, message: ack.err || ack.message});
				} else {
					this.setCredentials(credentials);
					resolve({ status: STATUS_SUCCESS, message });
				}
			});
		});
	}

	public async logout() {
		this.unsetCredentials();
		gun.user().leave();
	}

	private getCredentials(): Credentials|null {
		const username: string = sessionStorage.getItem(SESSION_KEY_USERNAME) || '';
		const password: string = sessionStorage.getItem(SESSION_KEY_PASSWORD) || '';
		if (!username || !password) {
			return null;
		}
		return { username, password };
	}

	private setCredentials(credentials: Credentials) {
		sessionStorage.setItem(SESSION_KEY_USERNAME, credentials.username);
		sessionStorage.setItem(SESSION_KEY_PASSWORD, credentials.password);
	}

	private unsetCredentials() {
		sessionStorage.removeItem(SESSION_KEY_USERNAME);
		sessionStorage.removeItem(SESSION_KEY_PASSWORD);
	}

	public setReferrer(url: string) {
		this.referer = url;
	}

	public getReferer(): string {
		return this.referer;
	}
}

export default new AuthService();
