import './main.sass';
import { Component, render } from 'inferno';
import { RouterComponent } from './components/routing/router.component';
const container = document.getElementById('app');

class RootComponent extends Component {
	public render(nextProps: any, nextState: any, nextContext: any) {
		return (
			<RouterComponent />
		);
	}
}

render(<RootComponent />, container);
