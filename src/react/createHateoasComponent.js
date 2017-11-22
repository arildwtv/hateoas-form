import React from 'react';
import invariant from 'invariant';
import hateoasForm from '../hateoasForm';
import stripEmbeddings from './stripEmbeddings';
import stripLinks from './stripLinks';
import propTypes from './propTypes';
import isPromise from '../util/isPromise';

function _patch(filter, key, value) {
  this.setState({ updating: true });
  this.hateoasForm.setProperty(this.state.resource, key, filter(value))
    .then(resource => this.setState({ resource, updating: false }));
};

function _patchAll(properties) {
  this.setState({ updating: true });
  this.hateoasForm.setProperties(this.state.resource, properties)
    .then(resource => this.setState({ resource, updating: false }));
}

function _parseValueFromEvent(event) {
  switch (event.target.type.toLowerCase()) {
    case 'checkbox': return event.target.checked;
    case 'number': return parseInt(event.target.value, 10);
    default: return event.target.value;
  }
}

function _patchFromEvent(filter, event) {
  _patch.call(
    this,
    filter,
    event.target.name,
    _parseValueFromEvent(event));
};

const contextTypes = {
  hateoasForm: propTypes.hateoasFormShape
};

export default function createHateoasComponent(config) {
  return Component => {
    class HateoasComponent extends React.Component {
      constructor(props, context) {
        super(props);
        this.state = { resource: null, links: [], fetching: true };
        this.hateoasForm = props.hateoasForm || context.hateoasForm;

        const { displayName } = Component;

        invariant(
          this.hateoasForm,
          `Could not find hateoasForm in either the context or props of ${displayName}. ` +
            `Either wrap the root element in a <HateoasProvider>, ` +
            `or explicitly pass hateoasForm as a prop to ${displayName}`);

        this.patch = _patch.bind(this, value => value);
        this.patchAll = _patchAll.bind(this);
        this.patchBooleanInput = _patchFromEvent.bind(this, value => ['1', 'true', true, 1].indexOf(value) > -1);
        this.patchNumberInput = _patchFromEvent.bind(this, value => parseInt(value, 10));
        this.patchInput = _patchFromEvent.bind(this, value => value);
      }

      componentWillMount() {
        this.fetchResource(this.props);
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
          this.fetchResource(nextProps);
        }
      }

      fetchResource(props) {
        const url = config && config.resolveUrl
          ? config.resolveUrl(props, this.hateoasForm.fetchResource)
          : props.url;

        (isPromise(url) ? url : Promise.resolve(url))
          .then(url => this.hateoasForm.fetchResource(url))
          .then(resource => {
            this.setState({ resource, fetching: false });
          });
      }

      render() {
        const resource = stripEmbeddings(this.state.resource);
        return (
          <Component
            {...this.props}
            rawResource={this.state.resource}
            resource={resource}
            resourceFormValues={stripLinks(resource)}
            patch={this.patch}
            patchAll={this.patchAll}
            patchInput={this.patchInput}
            patchBooleanInput={this.patchBooleanInput}
            patchNumberInput={this.patchNumberInput}
            fetching={this.state.fetching}
            updating={this.state.updating}
          />
        );
      }
    };

    HateoasComponent.contextTypes = contextTypes;

    return HateoasComponent;
  };
}
