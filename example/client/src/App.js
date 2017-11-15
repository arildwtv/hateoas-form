import React from 'react';
import { createHateoasComponent } from 'hateoas-form';
import './App.css';
import ResourceForm from './ResourceForm';
import ResourcePreview from './ResourcePreview';

const App = props =>
  <section className="sections">
    <ResourceForm {...props} />
    <ResourcePreview {...props} resource={props.rawResource} />
    <ResourcePreview {...props} />
  </section>;

export default createHateoasComponent()(App);
