// ts-lint:disable
import Gun from 'gun';
import 'gun/lib/load';
import 'gun/lib/path';
import 'gun/lib/unset';
import 'gun/lib/not';
// import 'gun/lib/then'; causes error right here
import 'gun/sea';
import 'gun/lib/then';
import 'gun/lib/open';
import 'gun/lib/load';
export const gun = Gun([
	'http://localhost:8080/gun'
]);
export const gunUser = gun.user();
