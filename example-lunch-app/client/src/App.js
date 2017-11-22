import React from 'react';
import { createHateoasComponent } from 'hateoas-form';
import './App.css';
import routes from './routes';
import getComponentAndParamsForRoute from './router/getComponentAndParamsForRoute';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { route: this.getRoute() };
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  getRoute() {
    return window.location.hash.replace(/^#\//, '');
  }

  handleHashChange() {
    const route = this.getRoute();
    this.setState({ route });
  }

  getComponentAndParamsForRoute() {
    return getComponentAndParamsForRoute(routes, this.getRoute());
  }

  render() {
    return (
      <section>
        {this.props.fetching &&
          <span>Loading ...</span>}
        {!this.props.fetching && (() => {
          const { component, params } = this.getComponentAndParamsForRoute();
          return React.createElement(component, { ...this.props, ...params });
        })()}
      </section>
    );
  }
}

export default createHateoasComponent()(App);
