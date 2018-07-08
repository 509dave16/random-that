import { Profile } from '../../components/pages/auth.page';

export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';

export interface FriendlyResponse {
	status: string;
	message: string;
	data?: any;
}

class AuthService {
	public login(profile: Profile): Promise<FriendlyResponse> {
		console.log(profile);
		return Promise.resolve({ status: STATUS_SUCCESS, message: 'logged in'});
	}

	public register(profile: Profile): Promise<FriendlyResponse> {
		console.log(profile);
		return Promise.resolve({ status: STATUS_SUCCESS, message: 'registered'});
	}
}

export default new AuthService();
