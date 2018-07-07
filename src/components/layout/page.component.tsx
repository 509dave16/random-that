import classNames from 'classnames';
import { Component } from 'inferno';
import { toggleClassesOnInteract } from '../../utils/css';
export interface HeaderOptions {
	back?: boolean;
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

	public onNavbarItemRef = (node) => {
		toggleClassesOnInteract(node, ['has-text-info']);
	}

	public gotoUrl = (url: string) => {
		this.props.history.push(url);
		this.toggleMenu();
	}

	public goBack = () => {
		this.props.history.goBack();
	}

	public toggleMenu = () => {
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
			back: true,
			backgroundColor: 'info',
			buttons: [],
			textColor: 'white',
			title: 'Default'
		};
		const options = Object.assign({}, defaultOptions, headerOptions);
		const backIconClassNames = classNames('icon', {'is-invisible': !options.back });
		return (
			<nav class={`navbar has-text-${options.textColor} has-background-${options.backgroundColor}`} role="navigation" aria-label="main navigation">
				<div class="navbar-brand">
					<div class="navbar-item is-hidden-tablet">
						<span className={backIconClassNames} onClick={this.goBack}><ion-icon name="arrow-back" color="light" size="large"></ion-icon></span>
						<h1 class="title has-text-white">{options.title}</h1>
					</div>

					<a onClick={this.toggleMenu} ref={ (el) => { this.hamburgerEl = el; }} role="button" class="navbar-burger has-text-white" aria-label="menu" aria-expanded="false">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>
				<div ref={ (el) => { this.menuEl = el; }} id="navMenu" class="navbar-menu">
					<div class="navbar-start m-l-auto">
						<a ref={(node) => this.onNavbarItemRef(node) } role="button" onClick={(e) => this.gotoUrl('/lists') } class="has-text-white has-text-info-mobile navbar-item">Lists</a>
						<h1 class="title has-text-white has-text-info-mobile navbar-item is-hidden-mobile is-marginless">Random That</h1>
						<a style={{ visibility: 'hidden' }} class="has-text-white has-text-info-mobile navbar-item is-hidden-mobile">Lists</a>
					</div>
				</div>
			</nav>
		);
	}
}
