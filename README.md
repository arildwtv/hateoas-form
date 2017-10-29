# redux-hateoas-form

## Usage

```js
import hateoasForm from 'hateoas-form';
```

## Vanilla JS
```js
const formInstance = hateoasForm({
  // An interceptor for fetch. Here, you may override the fetch calls, for instance adding authorization.
  fetch: function(url, init) {},

  // The URL exposing the API of the resource.
  url: 'http://api.example.com/my-resource',
  
  // Forces the form to re-fetch (i.e. GET) the resource from the URL. This can be useful when you know the resource has
  // been updated from somewhere else and you want to get the updated data.
  forceFetch: function() {},
  
  // Triggers an API update on a property.
  updateProperty: function(property, value) {},
  
  // Creates a resource based on the property.
  createResource: function(property, resource) {},
  
  // Callback called when the form is finished updating the resource with the API.
  resourceUpdated: function(resource) {},
  
  // Callback called when the form is finished updating a property
  propertyUpdated: function(field, value) {}
}

// ...

const formInstance = hateoasForm({
  url: 'http://api.example.com/person'
});

formInstance.then(resource => {
  formInstance.updateProperty('firstName', 'John'); // Triggers a PATCH call.
});

formInstance.onResourceUpdated(resource => {
  console.log('Resource updated!', resource);
});
```

## Usage With React

```jsx
// MyComponent.jsx

import { createHateoasComponent } from 'hateoas-form';

const MyComponent = ({ firstName }) =>
  <div>{firstName}</div>;
  
const MyHateoasComponent = createHateoasComponent({
  url: 'http://api.example.com/my-resource'
})(MyComponent);

export default MyHateoasComponent;

// ...

ReactDOM.render(<MyHateoasComponent />, domNode);
```

or:

```jsx
// MyComponent.jsx

const MyComponent = ({ firstName }) =>
  <div>{firstName}</div>;
  
const MyHateoasComponent = createHateoasComponent()(MyComponent);

export default MyHateoasComponent;

// ...

ReactDOM.render(<MyHateoasComponent url="http://api.example.com/my-resource" />, domNode);
```
