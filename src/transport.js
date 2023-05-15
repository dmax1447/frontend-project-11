import axios from 'axios';
import i18next from 'i18next';
import { parseRSS } from './helpers';

const getUrl = (targetUrl) => `https://allorigins.hexlet.app/get?url=${encodeURIComponent(targetUrl)}`;

function getFeed(url) {
  return axios.get(getUrl(url))
    .catch((e) => {
      throw new Error(i18next.t('feedback_messages.network_error'));
    })
    .then((r) => {
      const {
        contents,
        status,
      } = r.data;
      console.log({
        status,
        contents,
      });
      if (status.http_code !== 200) {
        throw new Error(i18next.t('feedback_messages.http_error'));
      }
      const isValidContent = status?.content_type?.includes('application/rss+xml') || status?.content_type?.includes('application/xml');
      if (!isValidContent) {
        throw new Error(i18next.t('feedback_messages.fetch_error'));
      }
      return parseRSS(contents);
    })
    .catch((e) => {
      console.warn(e);
      throw new Error(e.message || i18next.t('feedback_messages.generic_network_error'));
    });
}

export default getFeed;
