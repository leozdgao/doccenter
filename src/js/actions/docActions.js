import Reflux from 'reflux';

export default Reflux.createActions([
  'tags', // trigger when link to document section, load first page and tags
  'page', // trigger when pagination
  'docLoad' // triiger when try to view a document
]);
