import React from 'react';
import { compose } from 'redux';
import { createHateoasComponent } from 'hateoas-form';
import './App.css';
import ResourceForm from './ResourceForm';
import ResourcePreview from './ResourcePreview';

const App = props =>
  <section className="sections">
    <ResourceForm {...props} />
    <ResourcePreview resource={props.rawResource} />
    <ResourcePreview resource={props.resource} />
  </section>;

export default compose(
  createHateoasComponent({ url: '/api/shipments/1' })
)(App);
