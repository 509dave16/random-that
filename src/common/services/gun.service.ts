// ts-lint:disable
import Gun from 'gun/gun';
import 'gun/lib/not';
import 'gun/lib/open';
import 'gun/lib/load';
import 'gun/lib/unset';
import 'gun/lib/not';
import 'gun/lib/then';
import 'gun/sea';
export const gun = Gun({
	peers: ['http://localhost:8082/gun']
});
export const gunUser = gun.user();
