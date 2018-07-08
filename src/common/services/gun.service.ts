import Gun from 'gun';
import 'gun/lib/path';
import 'gun/sea';
export const gun = Gun([
	'http://localhost:8080/gun'
]);
export const gunUser = gun.user();
