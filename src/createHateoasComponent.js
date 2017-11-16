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
      this.hateoasForm = hateoasForm();
      this.patch = _patchFromEvent.bind(this, value => value);
      this.patchBoolean = _patchFromEvent.bind(this, value => ['1', 'true', true, 1].indexOf(value) > -1);
      this.patchNumber = _patchFromEvent.bind(this, value => parseInt(value, 10));
    }

    componentWillMount() {
      this.fetchResource(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.url !== this.props.url) {
        this.fetchResource(this.props);
      }
    }

    fetchResource(props) {
      this.hateoasForm.fetchResource(props.url || config.url)
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
