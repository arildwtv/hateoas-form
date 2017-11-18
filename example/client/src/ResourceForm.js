import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import './ResourceForm.css';

const ResourceForm = ({ handleSubmit, resource, updating, patchInput }) =>
  <form onSubmit={handleSubmit} className="resource-form">
    <label>
      <span className="label">Departure</span>
      <Field
        name="departure"
        placeholder="Departure"
        component="input"
        type="text"
        onBlur={patchInput}
        disabled={updating}
      />
    </label>
    <label>
      <span className="label">Manifest Description</span>
      <Field
        name="manifest.description"
        placeholder="Manifest description"
        component="input"
        type="text"
        onBlur={patchInput}
        disabled={updating}
      />
    </label>
    <ul className="goods-list">
      {((resource && resource.goods.item) || []).map((item, index) =>
        <li key={item._links.self.href}>
          <h2>Goods #{index + 1}</h2>
          <label>
            <span className="label">Description</span>
            <Field
              name={`goods.item[${index}].description`}
              placeholder={`Goods #${index + 1} description`}
              component="input"
              type="text"
              onBlur={patchInput}
              disabled={updating}
            />
          </label>
          <label>
            <span className="label">Does Goods Contain Hazardous Goods?</span>
            <Field
              name={`goods.item[${index}].hazardousGoods`}
              component="input"
              type="checkbox"
              onChange={patchInput}
              disabled={updating}
            />
          </label>
          <label>
            <span className="label">Weight</span>
            <Field
              name={`goods.item[${index}].weight`}
              component="input"
              type="number"
              onBlur={patchInput}
              disabled={updating}
            />
          </label>
        </li>
      )}
      <h2>Add Goods</h2>
      <label>
        <span className="label">Description</span>
        <Field
          name={`goods.item[${((resource && resource.goods.item.length) || 0)}].description`}
          placeholder={`Goods description`}
          component="input"
          type="text"
          onBlur={patchInput}
          disabled={updating}
        />
      </label>
    </ul>
  </form>;

const mapStateToProps = (state, { resourceFormValues }) => ({
  initialValues: resourceFormValues
});

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'shipmentForm'
  })
)(ResourceForm);
