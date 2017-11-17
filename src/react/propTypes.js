import PropTypes from 'prop-types';

export default {
  hateoasFormShape: PropTypes.shape({
    fetchResource: PropTypes.func.isRequired,
    setProperty: PropTypes.func.isRequired
  })
};
