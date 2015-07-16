import Reflux from 'reflux';
import pageheaderActions from '../actions/pageheaderActions';

export default Reflux.createStore({
  init () {
    this.listenToMany(pageheaderActions);
  },
  onChange (obj) {
    this.trigger(obj);
  }
});
