import classNames from 'classnames';
import { Component } from 'inferno';
import authService from '../../common/services/auth.service';
import { Breadcrumb, createBreadcrumbs } from '../../utils/component-helpers';
import { toggleClassesOnInteract } from '../../utils/css';
export interface HeaderOptions {
	back?: boolean;
	menu?: boolean;
	breadcrumbs?: boolean;
	loggedin?: boolean;
	buttons?: JSX.Element[];
	textColor?: string;
	backgroundColor?: string;
	title: string;
}

interface PageProps {
	history: any;
	headerOptions: HeaderOptions;
}

interface PageState {
	breadcrumbs: Breadcrumb[];
}

export class PageComponent extends Component<PageProps, PageState> {

	public hamburgerEl: any;
	public menuEl: any;

	constructor(props) {
		super(props);
		this.state = { breadcrumbs: [] };
	}

	public async componentWillMount() {
		const breadcrumbs: Breadcrumb[] = await createBreadcrumbs(window.location.pathname);
		this.setState({breadcrumbs});
	}

	public onNavbarItemRef = (node) => {
		toggleClassesOnInteract(node, ['has-text-info']);
	}

	public gotoUrl = (url: string) => {
		this.toggleMenu();
		this.props.history.push(url);
	}

	public goBack = () => {
		this.props.history.goBack();
	}

	public logout() {
		authService.logout();
		this.gotoUrl('/auth');
	}

	public toggleMenu = () => {
		this.hamburgerEl.classList.toggle('is-active');
		this.menuEl.classList.toggle('is-active');
	}

	public render(nextProps: PageProps, nextState: PageState, nextContext: any) {
		const defaultOptions: HeaderOptions = {
			back: true,
			backgroundColor: 'info',
			breadcrumbs: true,
			buttons: [],
			loggedin: authService.isAuthenticated(),
			menu: true,
			textColor: 'white',
			title: 'Default'
		};
		const options = Object.assign({}, defaultOptions, nextProps.headerOptions);
		return (
			<div>
				{ this.renderHeader(options) }
				{ this.renderBreadcrumbs(options, nextState)}
				<div class="container is-hidden-mobile m-b-xs">
					<h1 class="title is-capitalized">{nextProps.headerOptions.title}</h1>
				</div>
				<div class="container">
					{this.props.children}
				</div>
			</div>
		);
	}

	private renderHeader(options: HeaderOptions) {
		const backIconClassNames = classNames('icon', {'is-invisible': !options.back });
		const hamburgerClassNames = classNames('navbar-burger has-text-white', { 'is-invisible': !options.menu });
		const navItemClassNames = classNames('has-text-white has-text-info-mobile navbar-item', { 'is-invisible': !options.menu});
		const logoutClassNames = classNames('has-text-white has-text-info-mobile navbar-item', { 'is-invisible': !options.menu, 'is-hidden': !options.loggedin});
		return (
			<nav class={`navbar has-text-${options.textColor} has-background-${options.backgroundColor}`} role="navigation" aria-label="main navigation">
				<div class="navbar-brand">
					<div class="navbar-item is-hidden-tablet">
						<a className={backIconClassNames} onClick={this.goBack}><ion-icon name="arrow-back" color="light" size="large"></ion-icon></a>
						<h1 class="title has-text-white is-capitalized">{options.title}</h1>
					</div>

					<a onClick={this.toggleMenu} ref={ (el) => { this.hamburgerEl = el; }} role="button" className={hamburgerClassNames} aria-label="menu" aria-expanded="false">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>
				<div ref={ (el) => { this.menuEl = el; }} id="navMenu" class="navbar-menu">
					<div class="navbar-start m-l-auto">
						<a ref={(node) => this.onNavbarItemRef(node) } role="button" className={navItemClassNames} onClick={(e) => this.gotoUrl('/lists') } >Lists</a>
						<h1 class="title has-text-white has-text-info-mobile navbar-item is-hidden-mobile is-marginless">Random That</h1>
						<a ref={(node) => this.onNavbarItemRef(node) } role="button" className={logoutClassNames} onClick={(e) => this.logout() } >Logout</a>
					</div>
				</div>
			</nav>
		);
	}

	private renderBreadcrumbs(options: HeaderOptions, nextState: PageState) {
		const breadcrumbsClassNames = classNames('breadcrumb is-hidden-mobile', { 'is-invisible': !options.breadcrumbs });
		return (
			<nav className={breadcrumbsClassNames} aria-label="breadcrumbs">
				<ul>
					{
						nextState.breadcrumbs.map((crumb: Breadcrumb, index: number, breadcrumbs: Breadcrumb[]) => {
							const isActive = index === breadcrumbs.length - 1;
							const crumbClassNames = classNames({ 'is-active': isActive});
							return (<li className={crumbClassNames}><a role="button" onClick={(e) => this.gotoUrl(crumb.path)}>{crumb.name}</a></li>);
						})
					}
				</ul>
			</nav>
		);
	}
}
