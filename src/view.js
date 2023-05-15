const view = {
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('p.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  modalLink: document.querySelector('.modal-footer a'),
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

const getPostHtml = (post, isViewed) => `
    <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" class="fw-${isViewed ? 'normal' : 'bold'}" data-id="${post.guid}" target="_blank" rel="noopener noreferrer">${post.title}</a>
        <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.guid}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
    </li>
  `.trim();

const getPostListHtml = (list, viewedPostIds = []) => {
  const liHtml = list.map((item) => getPostHtml(item, viewedPostIds.includes(item.guid))).join('');
  return `
    <div class="card border-0">
        <div class="card-body"><h2 class="card-title h4">Посты</h2></div>
        <ul class="list-group border-0 rounded-0">
            ${liHtml}
        </ul>
    </div>
  `;
};

const updatePostReadState = (viewedPostIds) => {
  const postLinks = Array.from(view.posts.querySelectorAll('a'));
  postLinks.forEach((link) => {
    const isViewed = viewedPostIds.includes(link.dataset.id);
    link.classList.remove('fw-bold', 'fw-normal');
    link.classList.add(isViewed ? 'fw-normal' : 'fw-bold');
  });
};

function render(path, value, prevValue) {
  // console.log('render\n', { path, value, prevValue });
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
      break;
    case 'posts':
      view.posts.innerHTML = getPostListHtml(value, this.viewedPostIds);
      break;
    case 'urls':
      break;
    case 'modalPost':
      view.modalTitle.innerHTML = value.title;
      view.modalBody.innerHTML = value.description;
      view.modalLink.href = value.link;
      break;
    case 'viewedPostIds':
      updatePostReadState(value);
      break;
    default:
      console.warn('unknown path', path);
      break;
  }
}

const initView = ({ onSubmit, onPostClick } = {}) => {
  view.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const { value = '' } = evt.target.elements.url;
    onSubmit(value);
  });
  view.posts.addEventListener('click', (evt) => {
    const { id } = evt.target.dataset;
    if (id) {
      onPostClick(id);
    }
  });
};

export { render, view, initView };
