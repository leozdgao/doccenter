import Reflux from 'reflux';
import docActions from '../actions/docActions';
import {ajax} from '../utils/ajax';
import {querystring, ensure} from '../utils/helps';

export let cache = {}; // cache name only

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
        // cache names here
        res.forEach((article) => {
          cache[article._id] = article.title;
        });
        this.trigger({list: res, count: count});
      })
      .catch((e) => {
        this.trigger({fail: true});
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
  },
  onGetOneDoc (id) {
    ajax.get('/service/article/' + id)
      .then((res) => {
        this.trigger({article: res, loaded: true, message: ''});
      })
      .catch(() => {
        this.trigger({message: 'Failed to load article.'});
      });
  },
  onDocUpdate (id, body) {
    let {_id, ...update} = body;
    // put
    ajax.put('/service/article/' + id, update)
      .then((res) => {
        this.trigger({article: res, submitted: true});
      })
      .catch((xhr) => {
        let res, msg;
        if(xhr.hasTimeout) {
          msg = 'Request timeout.';
        }
        else {
          if(xhr.status == 0) {
            msg = 'Can\'t connect to server.';
          }
          else {
            try {
              res = JSON.parse(xhr.response);
              msg = res.msg || 'Unexpected error.';
            }
            catch(e) {
              msg = 'Unknown response.';
            }
          }
        }

        this.trigger({message: msg});
      });
  },
  onRemoveDocCompleted (res) {
    console.log(res);
    this.trigger({});
  },
  onRemoveDocFailed(res) {
    console.log(res);
    this.trigger({});
  }
});
