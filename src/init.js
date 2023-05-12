import onChange from 'on-change';
import { string } from 'yup';
import { render, view } from './view';

export default () => {

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

  const urlSchema = string().url('Ссылка должна быть валидным URL');
  const initControllers = (viewIntance) => {
    viewIntance.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const { value = '' } = evt.target.elements.url;
      urlSchema.validate(value.trim())
        .then((result) => {
          if (model.feeds.includes(result)) {
            model.valid = false;
            model.feedback = 'Такой URL уже добавлен';
          } else {
            model.valid = true;
            model.feedback = 'URL успешно добавлен';
            model.feeds.push(result);
            model.form.url = '';
          }
        })
        .catch((e) => {
          console.log('validation error:', e.message);
          model.valid = false;
          model.feedback = e.message;
        });
    });
  };

  initControllers(view);
};
