import Reflux from 'reflux';
// import {ajax} from '../util';

export default Reflux.createActions([
  'tags', // trigger when link to document section, load first page and tags
  'page', // trigger when pagination
  'docLoad', // triiger when try to view a document
  'getOneDoc',
  'docUpdate'
]);

// export let removeDoc = Reflux.createAction({ asyncResult: true });
// removeDoc.listenAndPromise(ajax.delete);
