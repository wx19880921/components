import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
//import FormControls from '../forms/FormControls';
//import FormGroup from '../forms/FormGroup';
//import bootstrapUtils from '../util/bootstrapUtils';
//import CustomPropTypes from '../util/CustomPropTypes';

class Button extends React.Component {
    /*
	static propTypes = {
        active: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        block: React.PropTypes.bool,
        //componentClass: "xxxxxxxxxxxxxxxxxxx",
        href: React.PropTypes.string,
        target: React.PropTypes.string,
        onClick: React.PropTypes.func,
        type: React.PropTypes.string
    };
   */
   /*
    static defaultProps = {
        active: false,
        block: false,
        bsClass: 'button',
        bsStyle: 'default',
        disabled: false,
        standalone: true,
        type: 'button'
    };
	*/

    renderAnchor(classes) {
        let Component = this.props.componentClass || 'a';
        let href = this.props.href || '#';
        let bsCls = this.props.bsStyle;
        classes.disabled = this.props.disabled;
        return (
            <Component
                key={'button'}
                {...this.props}
                href={href}
                className={classNames(this.props.className, classes, bsCls)}
                onClick={this.props.onClick}>
                {this.props.children}
            </Component>

        );
    }

    renderButton(classes) {
        let Component = this.props.componentClass || 'button';
        let bsCls = this.props.bsStyle;

        return (
            <Component
                key={'button'}
                {...this.props}
                type={this.props.type}
                className={classNames(this.props.className, classes, bsCls)}
                onClick={this.props.onClick}>
                {this.props.children}
            </Component>

        );
    }

    render() {

        // add button specific classes
        let classes = {
            active: this.props.active,
            'tm-btn-block': this.props.block
        };

        let renderFuncName = this.props.href || this.props.target ? 'renderAnchor' : 'renderButton';

        return this[renderFuncName](classes);
    }
}

Button.defaultProps = {
        active: false,
        block: false,
        bsClass: 'button',
        bsStyle: 'default',
        disabled: false,
        standalone: true,
        type: 'button'
};

Button.propTypes = {
        active: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        block: React.PropTypes.bool,
        componentClass: "xxxxxxxxxxxxxxxxxxx",
        href: React.PropTypes.string,
        target: React.PropTypes.string,
        onClick: React.PropTypes.func,
        type: React.PropTypes.string
    };

export default Button;
