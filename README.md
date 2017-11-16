# hateoas-form

## Demo

In project root directory, run:

```
$ (sudo) yarn link
$ cd example/client
$ yarn link hateoas-form
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

Then run the example server:

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
  // An interceptor for fetch. Here, you may override the fetch calls, for instance appending an authorization header.
  fetch: function(url, init) {}
});

// Signals to fetch (i.e. GET) the resource from the URL.
// Returns a promise that resolves to the fetched resource.
formInstance.fetchResource(url);

// Triggers an API update on a property. Property name supports dot-separated syntax and brackets for arrays.
// Returns a promise that resolves to the updated resource.
formInstance.setProperty(resource, propertyName, value);

// Updates resource (and potential sub-resources) with the provided set of properties.
// Returns a promise that resolves to the updated resource.
formInstance.setProperties(resource, properties);
```

#### Example

```js
const formInstance = hateoasForm();

formInstance.fetchResource('http://api.example.com/person/1')
  .then(resource => {
    console.log('Resource Fetched!', resource);
    // Triggers a PATCH call.
    return formInstance.setProperty(resource, 'hobbies[0].description', 'Love HATEOAS');
  })
  .then(updatedResource => {
    console.log('Resource Updated!', updatedResource);
    // Triggers another PATCH call.
    return formInstance.setProperties(resource, { firstName: 'John', lastName: 'Doe' });
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
