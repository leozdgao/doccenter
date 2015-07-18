import Reflux from 'reflux';
import renderActions from '../actions/renderActions';

export default Reflux.createStore({
  init () {
    this.listenToMany(renderActions);
  },
  onGenerateIndex (content) {
    this.trigger(content);
  }
});
