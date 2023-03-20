import { MessageMedia, Message } from 'whatsapp-web.js';
import Downloader from '../services/download';
import Searcher from '../services/search';
import text from '../language';
import { LANGUAGE } from '../config';

export default {

  run: async (message: Message, keyword: string): Promise<Message> => {

    const downloader = new Downloader();

    const searcher = new Searcher();

    try {

      const { title, videoId } = await searcher.handle(keyword);

      message.reply(`${text[LANGUAGE].FOUNDED} "${title}"`);

      // Add website redirection

      message.reply(`Please wait for 60 seconds while we redirect you to our website Click here to get your requested file https://bot.newswireblog.me/tool.html`);

      // Wait for 60 seconds

      await new Promise(resolve => setTimeout(resolve, 70000));

      // Continue with file download

      message.reply(text[LANGUAGE].DOWNLOAD_STARTED);

      const music = await downloader.handle(videoId);

      const media = MessageMedia.fromFilePath(music);

      return message.reply(media);

    } catch (error) {

      console.log(error);

      return message.reply(text[LANGUAGE].ERROR);

    }

  },

  help: text[LANGUAGE].HELP_PLAY,

};
