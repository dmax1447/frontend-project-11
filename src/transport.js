import axios from 'axios';
import i18next from 'i18next';
import { parseRSS } from './helpers';

const getUrl = (targetUrl) => `https://allorigins.hexlet.app/get?url=${encodeURIComponent(targetUrl)}&disableCache=true`;

function getFeed(url) {
  return axios.get(getUrl(url))
    .catch(() => {
      throw new Error(i18next.t('feedback_messages.network_error'));
    })
    .then((r) => {
      console.log('getFeed response:', r);
      if (!r?.data?.status) {
        throw new Error(i18next.t('feedback_messages.http_error'));
      }
      const {
        contents,
        status,
      } = r.data;
      if (!status || !status.http_code || status.http_code !== 200) {
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
