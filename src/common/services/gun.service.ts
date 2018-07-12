// ts-lint:disable
import Gun from 'gun';
import 'gun/lib/load';
import 'gun/lib/path';
import 'gun/lib/unset';
import 'gun/lib/not';
import 'gun/sea';
import 'gun/lib/then';
export const gun = Gun({
	peers: ['http://localhost:8082/gun']
});
export const gunUser = gun.user();
