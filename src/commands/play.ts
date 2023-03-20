import { MessageMedia, Message } from 'whatsapp-web.js';

import Downloader from '../services/download';

import Searcher from '../services/search';

import text from '../language';

import { LANGUAGE } from '../config';

import { google } from 'googleapis';

const analytics = google.analytics('v3');

const VIEW_ID = 'your_view_id'; // replace with your Google Analytics view ID

const SERVICE_ACCOUNT_EMAIL = 'your_service_account_email'; // replace with your Google Analytics service account email

const PRIVATE_KEY = 'your_private_key'; // replace with your Google Analytics service account private key

export default {

  run: async (message: Message, keyword: string): Promise<Message> => {

    const downloader = new Downloader();

    const searcher = new Searcher();

    try {

      const { title, videoId } = await searcher.handle(keyword);

      message.reply(`${text[LANGUAGE].FOUNDED} "${title}"`);

      const websiteUrl = "https://example.com"; // replace with your website URL

      message.reply(`Please visit ${websiteUrl} to download the file`);

      const music = await downloader.handle(videoId);

      // track user visits to your website using Google Analytics

      const trackVisit = async (websiteUrl: string) => {

        const jwt = new google.auth.JWT(SERVICE_ACCOUNT_EMAIL, null, PRIVATE_KEY, ['https://www.googleapis.com/auth/analytics.readonly']);

        await jwt.authorize();

        await analytics.data.ga.get({

          auth: jwt,

          ids: `ga:${VIEW_ID}`,

          'start-date': 'today',

          'end-date': 'today',

          metrics: 'ga:pageviews',

          dimensions: 'ga:pagePath',

          filters: `ga:pagePath==${websiteUrl}`,

        });

        // send the downloaded file via the chatbot

        const media = MessageMedia.fromFilePath(music);

        return message.reply(media);

      };

      trackVisit(websiteUrl);

    } catch (error) {

      console.log(error);

      return message.reply(text[LANGUAGE].ERROR);

    }

  },

  help: text[LANGUAGE].HELP_PLAY,

};
