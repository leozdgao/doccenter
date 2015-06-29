import Reflux from 'reflux';
import docActions from '../actions/docActions';
import {ajax, querystring, ensure} from '../util';

export default Reflux.createStore({
  init () {
    this.listenToMany(docActions);
  },
  onPage (page, conditions) {
    let count, limit = 10;
    let cqs = querystring(ensure({
      conditions: conditions
    }));
    ajax.get('/service/article/count?'+cqs)
      .then((res) => {
        count = res.count || 0;
        let qs = querystring(ensure({
          conditions: conditions,
          options: {
            skip: (page - 1) * limit,
            limit: limit,
            sort: {
              priority: -1,
              date: -1
            }
          }
        }));
        return ajax.get('/service/article?'+qs);
      })
      .then((res) => {
        this.trigger({list: res, count: count});
      })
      .catch((e) => {console.log(e);
        this.trigger({fail: 'page'});
      });
  },
  onTags () {
    ajax.get('/service/article/tags')
      .then((res) => {
        this.trigger({tags: res.tags});
      })
      .catch((e) => {
        this.trigger({fail: 'tag'});
      });
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
