import onChange from 'on-change';
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import { render, initView } from './view';
import ruMessages from './locales/ru';

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
      feeds: [],
      feedback: null,
      valid: null,
      processErrors: null,
    },
    render,
  );

  const onSubmit = (value) => {
    urlSchema.validate(value.trim())
      .then((result) => {
        if (model.feeds.includes(result)) {
          model.valid = false;
          model.feedback = i18next.t('feedback_messages.url_exist');
        } else {
          model.valid = true;
          model.feedback = i18next.t('feedback_messages.url_added');
          model.feeds.push(result);
          model.form.url = '';
        }
      })
      .catch((e) => {
        console.log('validation error:', e.message);
        model.valid = false;
        model.feedback = e.message;
      });
  };

  initView({ onSubmit });
};
