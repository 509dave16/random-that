import { Profile } from '../../components/pages/auth.page';
import { gunUser } from './gun.service';

export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';

export interface FriendlyResponse {
	status: string;
	message: string;
	data?: any;
}

class AuthService {
	private authenticated: boolean = false;
	private referrer: string = '/';

	public isAuthenticated() {
		return this.authenticated;
	}

	public setReferrer(referrer: string) {
		this.referrer = referrer;
	}

	public getReferrer(referrer: string): string {
		return this.referrer;
	}

	public login(profile: Profile): Promise<FriendlyResponse> {
		return new Promise((resolve, reject) => {
			gunUser.auth(profile.username, profile.password, (ack) => {
				if (ack.err) {
					reject({ status: STATUS_ERROR, message: ack.err});
				} else {
					this.authenticated = true;
					resolve({ status: STATUS_SUCCESS, message: 'logged in'});
				}
			});
		});
	}

	public register(profile: Profile): Promise<FriendlyResponse> {
		return new Promise((resolve, reject) => {
			gunUser.create(profile.username, profile.password, (ack) => {
				if (ack.err) {
					reject({ status: STATUS_ERROR, message: ack.err});
				} else {
					this.authenticated = true;
					resolve({ status: STATUS_SUCCESS, message: 'registered'});
				}
			});
		});
	}

	public logout() {
		console.log('do something');
	}
}

export default new AuthService();
