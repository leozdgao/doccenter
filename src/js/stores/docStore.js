import Reflux from 'reflux';
import docActions from '../actions/docActions';
import {ajax, querystring} from '../util';

export default Reflux.createStore({
  init () {
    this.listenToMany(docActions);
  },
  onPage (page) {
    let count, limit = 15;
    ajax.get('/service/article/count')
      .then((res) => {
        count = res.count || 0;
        let qs = querystring({
          options: {
            skip: (page - 1) * limit,
            limit: limit,
            sort: {
              priority: -1,
              date: -1
            }
          }
        });
        return ajax.get('/service/article?'+qs);
      })
      .then((res) => {
        this.trigger({list: res, count: count});
      })
      .catch((e) => { console.log(e);
        this.trigger();
      })
  },
  onTags () {
    ajax.get('/service/article/tags')
      .then((res) => {
        this.trigger({tags: res.tags});
      })
      .catch((e) => { console.log(e);
        this.trigger();
      })
  },
  onDocLoad (id) {
    ajax.get('/service/article/' + id)
      .then((res) => {
        this.trigger(res);
      })
      .catch(() => {
        this.trigger();
      });
  }
});
