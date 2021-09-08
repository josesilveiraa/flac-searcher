import inquirer from 'inquirer';

import redditSearch from './util/redditSearcher';
import torrentSearch, { Site } from './util/torrentSearcher';

inquirer.prompt([

  {
    name: "searchType",
    type: "list",
    message: "Which search type would you like to choose?",
    choices: ["torrentz", "reddit (r/riprequests)"]
  },
  
  {
    name: "query",
    message: "What song would you like to download?"
  }

]).then(async ({ searchType, query }) => {


  switch(searchType) {
    case "torrentz":
      const torrents = await torrentSearch(query, Site.TorrentZ);
      torrents.forEach((torrent) => {
        console.log("================");
        console.log(`Title: ${torrent.title}`);
        console.log(`Last updated: ${torrent.lastUpdated}`);
        console.log(`Seeders: ${torrent.seeders}`);
        console.log(`Leechers: ${torrent.leechers}`);
        console.log(`Size: ${torrent.size}`);
        console.log(`Magnet link: ${torrent.magnetLink}`);
        console.log("================\n");
      });
      break;

    case "reddit (r/riprequests)":
      await redditSearch(query);
      break;
    default: 
      break;
  }


}).catch((err) => {
  if(err) throw err;
})