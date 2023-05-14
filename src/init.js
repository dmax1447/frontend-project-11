import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import { string, setLocale } from 'yup';
import { render, initView } from './view';
import ruMessages from './locales/ru';
import { parseRSS } from './helpers';

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
    urlSchema.validate(value.trim())
      .then((url) => {
        if (model.urls.includes(url)) {
          model.valid = false;
          model.feedback = i18next.t('feedback_messages.url_exist');
        } else {
          model.valid = true;
          model.feedback = i18next.t('feedback_messages.url_added');
          model.urls.push(url);
        }
        return url;
      })
      .catch((e) => {
        console.log('validation error:', e.message);
        model.valid = false;
        model.feedback = e.message;
      })
      .then((url) => axios.get(getUrl(url)))
      .then((r) => {
        const { contents, status } = r.data;
        console.log({ status, contents });
        const isValidContent = status.content_type.includes('application/rss+xml') || status.content_type.includes('application/xml');
        if (status.http_code === 200 && isValidContent) {
          const { feed, posts } = parseRSS(contents);
          feed.url = value.trim();
          model.feeds.push(feed);
          model.posts.push(...posts);
        } else {
          model.valid = false;
          model.feedback = i18next.t('feedback_messages.fetch_error');
        }
      })
      .then(() => {
        model.form.url = '';
      });
  };

  initView({ onSubmit });
};
