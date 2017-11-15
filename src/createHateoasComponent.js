import React from 'react';
import hateoasForm from './hateoasForm';
import stripEmbeddings from './stripEmbeddings';

function _patch(key, value) {
  this.setState({ updating: true });
  this.hateoasForm.setProperty(this.state.resource, key, value)
    .then(resource => this.setState({ resource, updating: false }));
};

function _patchFromEvent(filter, event) {
  _patch.call(
    this,
    event.target.name,
    filter(event.target.type.toLowerCase() === 'checkbox' ? event.target.checked : event.target.value));
};

export default function createHateoasComponent(config) {
  return Component => class HateoasComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { resource: null, links: [], fetching: true };
      this.patch = _patchFromEvent.bind(this, value => value);
      this.patchBoolean = _patchFromEvent.bind(this, value => ['1', 'true', true, 1].indexOf(value) > -1);
      this.patchNumber = _patchFromEvent.bind(this, value => parseInt(value, 10));
    }

    componentDidMount() {
      this.fetchResource(this.props);
    }

    componentDidUpdate() {
      this.fetchResource(this.props);
    }

    fetchResource(props) {
      this.hateoasForm = hateoasForm({
        url: props.url || config.url
      });

      this.hateoasForm.fetchResource()
        .then(resource => {
          this.setState({ resource, fetching: false });
        });
    }

    render() {
      return (
        <Component
          {...this.props}
          rawResource={this.state.resource}
          resource={stripEmbeddings(this.state.resource)}
          patch={this.patch}
          patchBoolean={this.patchBoolean}
          patchNumber={this.patchNumber}
          fetching={this.state.fetching}
          updating={this.state.updating}
        />
      );
    }
  };
}
