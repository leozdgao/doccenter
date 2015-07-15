import Reflux from 'reflux';
import pageheaderActions from '../actions/pageheaderActions';

export default Reflux.createStore({
  init () {
    this.listenToMany(docActions);
  },
  onChange (title, breadcrumbs) {
    this.trigger({ title, breadcrumbs });
  }
