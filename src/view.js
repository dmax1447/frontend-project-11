const view = {
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('p.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
};
const getFeedItemHtml = (feed) => `
    <li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    </li>`.trim();

const getFeedListHtml = (list) => {
  const itemsHtml = list.map(getFeedItemHtml).join('');
  return `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">Фиды</h2>
      </div>
      <ul class="list-group border-0 rounded-0">${itemsHtml}</ul>
    </div>`;
};

const getPostHtml = (post) => `
    <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">${post.title}</a>
        <button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
    </li>
  `.trim();

const getPostListHtml = (list) => {
  const liHtml = list.map(getPostHtml).join('');
  return `
    <div class="card border-0">
        <div class="card-body"><h2 class="card-title h4">Посты</h2></div>
        <ul class="list-group border-0 rounded-0">
            ${liHtml}
        </ul>
    </div>
  `;
};

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
      view.input.focus();
      break;
    case 'feeds':
      view.feeds.innerHTML = getFeedListHtml(value);
      view.posts.innerHTML = getPostListHtml(value.flatMap((item) => item.posts));
      break;
    default:
      console.warn('unknown path', path);
      break;
  }
};

const initView = ({ onSubmit } = {}) => {
  view.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const { value = '' } = evt.target.elements.url;
    onSubmit(value);
  });
};

export { render, view, initView };
