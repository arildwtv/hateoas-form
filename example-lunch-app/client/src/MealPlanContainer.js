import { connect } from 'react-redux';
import { getLinkHref } from 'hateoas-form';
import MealPlan from './MealPlan';

const mapStateToProps = (state, { resource: api, isoWeek }) => ({
  url: isoWeek
    ? getLinkHref(api._links.findMealPlan, { isoWeek })
    : getLinkHref(api._links.currentMealPlan)
});

export default connect(mapStateToProps)(MealPlan);
