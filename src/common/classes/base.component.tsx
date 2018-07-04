import { Component } from 'inferno';
import {
	handleFormSubmitHoc,
	handleInputHoc,
	handleStateInputHoc
} from '../../utils/component-helpers';

export abstract class BaseComponent<Props, State> extends Component<Props, State> {
	protected handleInput: Function;
	protected handleStateInput: Function;
	protected handleFormSubmit: Function;

	constructor(props) {
		super(props);
		this.handleInput = handleInputHoc().bind(this);
		this.handleStateInput = handleStateInputHoc().bind(this);
		this.handleFormSubmit = handleFormSubmitHoc().bind(this);
	}
}
