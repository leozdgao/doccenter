import Reflux from 'reflux';
import pageheaderActions from '../actions/pageheaderActions';

export default Reflux.createStore({
  init () {
    this.listenToMany(pageheaderActions);
  },
  onChange (title, breadcrumbs) {
    this.trigger({ title, breadcrumbs });
  }
});
