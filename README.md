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

HATEOAS Form comes with bindings for React. The two components you need to care about are:

- `HateoasProvider`
- `createHateoasComponent`

#### `<HateoasProvider hateoasForm>`

This component provides your HATEOAS components with the functionality needed to perform HATEOAS requests. You should mount this component at the root of your React component tree.

##### Props
- `hateoasForm` (`Object`) - The instance of a HATEOAS Form, i.e. `hateoasForm()`.

```jsx
import hateoasForm, { HateoasProvider } from 'hateoas-form';

const hateoasFormInstance = hateoasForm();

ReactDOM.render(
  <HateoasProvider hateoasForm={hateoasFormInstance}>
    <App />
  </HateoasProvider>,
  document.getElementById('root'));
```

This is similar to how the React bindings for Redux works. Incidentally, if you need both Redux and HATEOAS functionality, it does not matter which component wraps the other:

```jsx
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import hateoasForm, { HateoasProvider } from 'hateoas-form';

// Create some store...
// const store = ...;

const hateoasFormInstance = hateoasForm();

ReactDOM.render(
  <Provider store={store}>
    <HateoasProvider hateoasForm={hateoasFormInstance}>
      <App />
    </HateoasProvider>
  </Provider>,
  document.getElementById('root'));
```

### `createHateoasComponent([{ url }])(Component)`

This is a Higher Order Component (HOC) that encapsulates your component. Use this HOC when you want your React component to be enhanced with HATEOAS functionality.

#### Simple Example

```jsx
// YourResourceComponent.jsx
import { createHateoasComponent } from 'hateoas-form';

const YourHateoasComponent = ({ resource, fetching }) =>
  <pre>
    {fetching
      ? 'Fetching Resource...'
      : JSON.stringify(resource, null, 4)}
  </pre>;

export default createHateoasComponent()(YourHateoasComponent);

// App.jsx
const App = () =>
  <YourHateoasComponent url="https://example.api.com/shipments/1" />;

export default App;
```

#### Parameters

- `resolveUrl(props, fetchResource)` (`Function`) - Optional. A function that returns the URL of the resource that you want your component to work with. The HOC also accepts a promise as the return type. In which case, it will expect the promise to resolve with the URL. In most cases, however, it's recommended to pass the URL to the component as a prop. This functionality is useful when your component receives a resource URL, but you ultimately want it to work with a linked resource from that resource URL. To traverse your API, use the `fetchResource` argument that is passed to the function.

```jsx
import { createHateoasComponent } from 'hateoas-form';

const BlogPostCommentsComponent = ({ resource, fetching }) =>
  <pre>
    {fetching
      ? 'Fetching Comments...'
      : JSON.stringify(resource, null, 4)}
  </pre>;

export default createHateoasComponent({
  resolveUrl: (props, fetchResource) =>
  	fetchResource(props.url)
      .then(resource => resource._links.comments.href)
})(BlogPostCommentsComponent);

// App.jsx
const App = () =>
  <BlogPostCommentsComponent url="https://example.api.com/blog-posts/1" />;

export default App;
```

Your enhanced component receives a set of props from the HOC:

- `resource` (`Object`|`null`) - The resource that your HATEOAS component manages, as defined by the provided URL.
- `resourceFormValues` (`Object`|`null`) - The resource with the links stripped out and the embeddings merged with the resource.
- `rawResource` (`Object`|`null`) - The resource exactly as that was passed from the backend.
- `fetching` (`boolean`) - Whether the resource is being fetched from the backend.
- `updating` (`boolean`) - Whether the resource is being updated, i.e. sent to the backend.
- `patch(key, value)` - A function that proxies to the `setProperty` function for your given resource. Can be useful if you want to update a property upon, e.g., clicking a button. For general inputs, consider using `patchInput` instead.
- `patchAll(values)` - A function that proxies to the `setProperties` function for your given resource. Can be useful if you want to update all values in a form when you submit it.
- `patchInput(event)` (`function`) - Accepts a DOM event triggered from an HTML input element that has a name representing the property to patch, and a value with which to patch the property. The function parses the value based on the type of HTML input element that triggered the DOM event, e.g. `text`, `checkbox`, `number`, etc. Typical usage is to set this function as a callback on `onBlur` or `onChange` props on `input` elements.
- `patchBooleanInput(event)` (`function`) - The same as `patchInput`, but also parses the target value to a boolean value. Use this if you need the value to be parsed to a boolean value from an input element that otherwise is not considered to manage a boolean value, e.g. a `select` component.
- `patchNumberInput(event)` (`function`) - The same as `patchInput`, but also parses the target value to a number. Use this if you need the value to be parsed to a numerical value from an input element that otherwise is not considered to manage a numerical value, e.g. a `select` component.
