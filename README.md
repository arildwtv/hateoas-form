# redux-hateoas-form

## Usage

```js
import reduxHateoasForm from 'redux-hateoas-form';
```

## API
```js
const formInstance = reduxHateoasForm({
  // An interceptor for fetch. Here, you may override the fetch calls, for instance adding authorization.
  fetch: function(url, init) {},

  // The URL exposing the API of the resource.
  url: 'http://api.example.com/my-resource',
  
  // Forces the form to re-fetch (i.e. GET) the resource from the URL. This can be useful when you know the resource has
  // been updated from somewhere else and you want to get the updated data.
  forceFetch: function() {},
  
  // Triggers an API update on a property.
  updateProperty: function(property, value) {},
  
  // Callback called when the form is finished updating the resource with the API.
  resourceUpdated: function(resource) {},
  
  // Callback called when the form is finished updating a property
  propertyUpdated: function(field, value) {}
}
```
