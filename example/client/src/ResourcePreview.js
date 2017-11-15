import React from 'react';
import renderjson from 'renderjson';
import './ResourcePreview.css';

renderjson.set_show_to_level('all');
renderjson.set_icons('+', '-');

class ResourcePreview extends React.Component {

  componentDidMount() {
    this.component.innerHTML = '';
    this.component.appendChild(renderjson(this.props.resource));
  }

  componentDidUpdate() {
    this.component.innerHTML = '';
    this.component.appendChild(renderjson(this.props.resource));
  }

  render() {
    return <section className="resource-preview" ref={c => { this.component = c; }} />;
  }
}

export default ResourcePreview;
