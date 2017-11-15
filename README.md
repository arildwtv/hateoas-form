# hateoas-form

## Demo

In project root directory, run:

```
$ (sudo) yarn link
```

Then run the example server:

```
cd example/server
yarn
yarn start
```

Then run the example client:

```
cd example/client
yarn
yarn start
```

The browser should open the example client automatically.

## Develop

In project root directory, run:

```
$ (sudo) yarn link
```

Then run the library:

```
yarn watch
```

Then run the server:

```
cd example/server
yarn
yarn watch
```

Then run the example client:

```
cd example/client
yarn
yarn start
```

The browser should open the example client automatically.

## API

### Vanilla JS
```js
import hateoasForm from 'hateoas-form';

const formInstance = hateoasForm({
  // An interceptor for fetch. Here, you may override the fetch calls, for instance adding authorization.
  fetch: function(url, init) {},

  // The URL exposing the API of the resource.
  url: 'http://api.example.com/my-resource'
});

// Signals the form to fetch (i.e. GET) the resource from the URL. This can be useful when you know the resource has
// been updated from somewhere else and you want to get the updated data.
formInstance.fetchResource();

// Triggers an API update on a property. Property name supports dot-separated syntax and brackets for arrays.
formInstance.setProperty(resource, propertyName, value);

// Updates resource (and potential sub-resources) with the provided set of properties.
formInstance.setProperties(resource, properties);
```

#### Example

```js
const formInstance = hateoasForm({
  url: 'http://api.example.com/person/1'
});

formInstance.fetchResource()
  .then(resource => {
    console.log('Resource Fetched!', resource);
    return formInstance.setProperty(resource, 'hobbies[0].description', 'Love HATEOAS') // Triggers a PATCH call.
  })
  .then(updatedResource => {
    console.log('Resource Updated!', updatedResource);
    return formInstance.setProperties(resource, { firstName: 'John', lastName: 'Doe' }); // Triggers another PATCH call.
  })
  .then(updatedResource => {
    console.log('Resource Updated Again!', updatedResource);
  });
```

### React

#### Example

```jsx
import { createHateoasComponent } from 'hateoas-form';

const YourResourceComponent = ({ resource, fetching }) =>
  <pre>{fetching ? 'Fetching Resource...' : JSON.stringify(resource, null, 4)}</pre>;

export default createHateoasComponent({ url: 'https://example.api.com/shipments/1' })(YourResourceComponent);
```

Or:

```jsx
// YourResourceComponent.jsx
import { createHateoasComponent } from 'hateoas-form';

const YourResourceComponent = ({ resource, fetching }) =>
  <pre>{fetching ? 'Fetching Resource...' : JSON.stringify(resource, null, 4)}</pre>;

export default createHateoasComponent()(YourResourceComponent);

// App.jsx
const App = ({ resource }) =>
  <YourResourceComponent url="https://example.api.com/shipments/1" />;

export default App;
```