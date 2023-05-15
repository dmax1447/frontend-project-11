import * as bootstrap from 'bootstrap';
import onChange from 'on-change';
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import { render, initView } from './view';
import ruMessages from './locales/ru';
import getFeed from './transport';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: ruMessages,
      },
    },
  });

  setLocale({
    string: {
      required: i18next.t('feedback_messages.required'),
      url: i18next.t('feedback_messages.url_invalid'),
    },
  });

  const urlSchema = string().url();

  const model = onChange(
    {
      form: {
        url: null,
      },
      urls: [],
      feeds: [],
      posts: [],
      viewedPostIds: [],
      feedback: null,
      valid: null,
      processErrors: null,
    },
    render,
  );

  const updatePosts = (feedId) => {
    if (!feedId) return;
    const { url } = model.feeds.find((feed) => feed.id === feedId);
    setTimeout(() => {
      getFeed(url)
        .then(({ posts }) => {
          const existedPostIds = model.posts
            .filter((post) => post.feedId === feedId)
            .map((post) => post.guid);
          const newPosts = posts
            .filter((item) => !existedPostIds.includes(item.guid))
            .map((item) => ({ ...item, feedId }));
          if (newPosts.length) {
            model.posts.unshift(...newPosts);
          }
          updatePosts(feedId);
        })
        .catch((e) => {
          throw new Error(e.message);
        });
    }, 5000);
  };

  const onSubmit = (value) => {
    const urlValue = value.trim();
    urlSchema.validate(urlValue)
      .then((url) => {
        if (model.urls.includes(url)) {
          throw new Error(i18next.t('feedback_messages.url_exist'));
        }
        return url;
      })
      .then(((url) => getFeed(url)))
      .then(({
        feed,
        posts,
      }) => {
        const feedWithUrl = { ...feed, url: urlValue };
        model.feeds.push(feedWithUrl);
        model.posts.push(...posts);
        model.form.url = '';
        model.valid = true;
        model.feedback = i18next.t('feedback_messages.url_added');
        model.urls.push(urlValue);
        updatePosts(feed.id);
      })
      .catch((e) => {
        model.valid = false;
        model.feedback = e.message;
      });
  };

  const onPostClick = (id) => {
    const post = model.posts.find((item) => item.guid === id);
    model.viewedPostIds.push(id);
    model.modalPost = post;
  };

  initView({ onSubmit, onPostClick });
};
