import marked from 'marked';

let renderer = new marked.Renderer(), seed = 0;
renderer.heading = (text, level) => {
  let id = 'header' + (seed ++);
  return `<h${level} id="${id}">${text}</h${level}>`;
};
renderer.html = (html) => {
  return html.replace(/<t(able|h|d|r)([^<>]*?) class="([^<>]*)"([^<>]*?)>/g, '<t$1$2$4>');
};

export default {
  mdParse (input) {
    seed = 0;
    return marked(input, { renderer: renderer });
  }
}
