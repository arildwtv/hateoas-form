import React, { Children } from 'react';
import propTypes from './propTypes';

class HateoasFormProvider extends React.Component {
  getChildContext() {
    return { hateoasForm: this.hateoasForm };
  }

  constructor(props, context) {
    super(props, context)
    this.hateoasForm = props.hateoasForm;
  }

  render() {
    return Children.only(this.props.children);
  }
}

HateoasFormProvider.childContextTypes = {
  hateoasForm: propTypes.hateoasFormShape
};

export default HateoasFormProvider;
