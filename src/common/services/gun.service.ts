import Gun from 'gun';
import 'gun/lib/path';
import 'gun/sea';
export const gun = Gun([
	'http://localhost:8081/gun'
]);
export const gunUser = gun.user();
console.log(gunUser);
