import Reflux from 'reflux';
import tagActions from '../actions/tagActions';
import {ajax} from '../utils/ajax';

export default Reflux.createStore({
  init () {
    this.listenToMany(tagActions);
  },
  onLoadAll () {
    ajax.get('/service/article/tags')
      .then((res) => {
        this.trigger({tags: res.tags});
      })
      .catch((e) => {
        this.trigger({fail: true});
      });
  }
});
