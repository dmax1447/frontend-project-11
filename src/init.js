import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import { string, setLocale } from 'yup';
import { render, initView } from './view';
import ruMessages from './locales/ru';
import { parseRSS } from './helpers';
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
      feedback: null,
      valid: null,
      processErrors: null,
    },
    render,
  );

  const getUrl = (targetUrl) => `https://allorigins.hexlet.app/get?url=${encodeURIComponent(targetUrl)}`;

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
        model.feeds.push(feed);
        model.posts.push(...posts);
        model.form.url = '';
        model.valid = true;
        model.feedback = i18next.t('feedback_messages.url_added');
        model.urls.push(urlValue);
      })
      .catch((e) => {
        model.valid = false;
        model.feedback = e.message;
      });
  };

  initView({ onSubmit });
};
