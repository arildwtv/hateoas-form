import React from 'react';
import hateoasForm from './hateoasForm';
import stripEmbeddings from './stripEmbeddings';

function _patch(key, value) {
  this.hateoasForm.setProperty(this.state.resource, key, value)
    .then(resource => this.setState({ resource }));
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
      this.hateoasForm = hateoasForm({
        url: props.url || config.url
      });
      this.state = { resource: null, links: [] };
      this.patch = _patchFromEvent.bind(this, value => value);
      this.patchBoolean = _patchFromEvent.bind(this, value => ['1', 'true', true, 1].indexOf(value) > -1);
      this.patchNumber = _patchFromEvent.bind(this, value => parseInt(value, 10));
    }

    componentDidMount() {
      this.hateoasForm.fetchResource()
        .then(resource => {
          const rels = Object.keys(resource._links);
          const links = rels.map(rel => Object.assign({}, { rel }, resource._links[rel]));
          this.setState({ resource, links });
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
        />
      );
    }
  };
}
