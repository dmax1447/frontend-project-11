import axios from 'axios';
import i18next from 'i18next';
import parseRSS from './helpers';

const getUrl = (targetUrl) => `https://allorigins.hexlet.app/get?url=${encodeURIComponent(targetUrl)}&disableCache=true`;

function getFeed(url) {
  return axios.get(getUrl(url))
    .catch(() => {
      throw new Error(i18next.t('feedback_messages.network_error'));
    })
    .then((r) => {
      if (r?.status !== 200) {
        throw new Error(i18next.t('feedback_messages.http_error'));
      }
      try {
        return parseRSS(r.data.contents);
      } catch (e) {
        throw new Error(i18next.t('feedback_messages.fetch_error'));
      }
    })
    .catch((e) => {
      throw new Error(e.message || i18next.t('feedback_messages.generic_network_error'));
    });
}

export default getFeed;
