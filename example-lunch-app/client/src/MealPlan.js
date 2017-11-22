import React from 'react';
import { createHateoasComponent } from 'hateoas-form';
import Anchor from './Anchor';
import './MealPlan.css';

const MealPlan = ({ resource }) =>
  <section>
    {
      resource &&
        <section>
          <h1>Meal Plan Week {resource.week}</h1>
          {resource._links.previous &&
            <Anchor className="previous" link={resource._links.previous}>Previous</Anchor>}
          {resource._links.next &&
            <Anchor className="next" link={resource._links.next}>Next</Anchor>}
          <pre>{JSON.stringify(resource, null, 4)}</pre>
        </section>
    }
  </section>;

export default createHateoasComponent()(MealPlan);
