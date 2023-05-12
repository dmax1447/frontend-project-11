const view = {
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('p.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
};
// const getFeedItemHtml = (feed) => {
//   return `
//     <li class="list-group-item border-0 border-end-0">
//       <h3 class="h6 m-0">BuzzFeed News</h3>
//       <p class="m-0 small text-black-50">BuzzFeed, Reporting To You</p>
//     </li>`.trim();
// }

const render = (path, value, prevValue) => {
  console.log('render\n', { path, value, prevValue });
  switch (path) {
    case 'valid':
      view.input.classList[!value ? 'add' : 'remove']('is-invalid');
      view.feedback.classList[!value ? 'add' : 'remove']('text-danger');
      view.feedback.classList[value ? 'add' : 'remove']('text-success');
      break;
    case 'feedback':
      view.feedback.textContent = value;
      break;
    case 'form.url':
      view.input.value = value;
      break;
    default:
      console.warn('unknown path', path);
      break;
  }
};

export { render, view };
