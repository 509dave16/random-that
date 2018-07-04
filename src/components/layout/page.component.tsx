import { Component } from 'inferno';
export interface HeaderOptions {
	buttons?: JSX.Element[];
	textColor?: string;
	backgroundColor?: string;
	title: string;
}

export interface PageProps {
	history: any;
	headerOptions: HeaderOptions;
}

export class PageComponent extends Component<PageProps, {}> {

	public hamburgerEl: any;
	public menuEl: any;

	public gotoUrl = (url: string) => {
		this.props.history.push(url);
	}

	public toggleMenu = (e: Event) => {
		this.hamburgerEl.classList.toggle('is-active');
		this.menuEl.classList.toggle('is-active');
	}

	public render(nextProps: PageProps, nextState: {}, nextContext: any) {
		return (
			<div>
				{ this.createHeader(nextProps.headerOptions) }
				<div class="container is-hidden-mobile">
					<h1 class="title">{nextProps.headerOptions.title}</h1>
				</div>
				<div class="container">
					{this.props.children}
				</div>
			</div>
		);
	}

	private createHeader(headerOptions: HeaderOptions) {
		const defaultOptions: HeaderOptions = {
			backgroundColor: 'info',
			buttons: [],
			textColor: 'white',
			title: 'Default'
		};
		const options = Object.assign({}, defaultOptions, headerOptions);
		return (
			<nav class={`navbar has-text-${options.textColor} has-background-${options.backgroundColor}`} role="navigation" aria-label="main navigation">
				<div class="navbar-brand">
					<div class="navbar-item is-hidden-tablet">
						<h1 class="title">{options.title}</h1>
					</div>

					<a onClick={this.toggleMenu} ref={ (el) => { this.hamburgerEl = el; }} role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>
				<div ref={ (el) => { this.menuEl = el; }} id="navMenu" class="navbar-menu">
					<div class="navbar-start">
						<a role="button" onClick={(e) => this.gotoUrl('/lists') } class="navbar-item">Lists</a>
					</div>
				</div>
			</nav>
		);
	}
}
