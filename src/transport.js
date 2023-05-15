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
      console.log('request response:', r);
      if (r?.status !== 200) {
        console.log('r?.status !== 200');
        throw new Error(i18next.t('feedback_messages.http_error'));
      }
      const {
        contents,
        status,
      } = r.data;
      console.log('data status & contents:\n', { status, contents });
      // if (!status || !status.http_code || status.http_code !== 200) {
      //   console.log('data: !status || !status.http_code || status.http_code !== 200');
      //   throw new Error(i18next.t('feedback_messages.http_error'));
      // }
      // const isValidContent = status?.content_type?.includes('xml');
      // if (!isValidContent) {
      //   console.log('!isValidContent');
      //   throw new Error(i18next.t('feedback_messages.fetch_error'));
      // }
      try {
        const parsed = parseRSS(contents);
        return parsed;
      } catch (e) {
        throw new Error(i18next.t('feedback_messages.fetch_error'));
      }
    })
    .catch((e) => {
      console.log('error getFeed');
      console.warn(e.message);
      throw new Error(e.message || i18next.t('feedback_messages.generic_network_error'));
    });
}

export default getFeed;
