import classNames from 'classnames';
import { Component } from 'inferno';
import { Breadcrumb, createBreadcrumbs } from '../../utils/component-helpers';
import { toggleClassesOnInteract } from '../../utils/css';
export interface HeaderOptions {
	back?: boolean;
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

	public toggleMenu = () => {
		this.hamburgerEl.classList.toggle('is-active');
		this.menuEl.classList.toggle('is-active');
	}

	public render(nextProps: PageProps, nextState: PageState, nextContext: any) {
		return (
			<div>
				{ this.renderHeader(nextProps.headerOptions) }
				{ this.renderBreadcrumbs(nextState)}
				<div class="container is-hidden-mobile">
					<h1 class="title">{nextProps.headerOptions.title}</h1>
				</div>
				<div class="container">
					{this.props.children}
				</div>
			</div>
		);
	}

	private renderHeader(headerOptions: HeaderOptions) {
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
						<a className={backIconClassNames} onClick={this.goBack}><ion-icon name="arrow-back" color="light" size="large"></ion-icon></a>
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

	private renderBreadcrumbs(nextState: PageState) {
		return (
			<nav class="breadcrumb" aria-label="breadcrumbs">
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
