import axios from 'axios';
import cheerio from 'cheerio';

export enum Site {
  TorrentZ,
  TorrentZ_Beta,
}

type Torrent = {
  title: string;
  lastUpdated: string;
  seeders: string;
  leechers: string;
  size: string;
  magnetLink: string;
}

const torrentSearch = async (query: string, site: Site) => {
  const torrents: Torrent[] = [];

  if (site === Site.TorrentZ) {

    const { data } = await axios.get("https://torrentzeu.org/data.php?q=" + encodeURIComponent(query));
    const $ = cheerio.load(data);

    $("table#table tbody tr").each((i, el) => {
      const children = $(el).children();

      const title = $(children[0]).text().replace("\t", "").trim();
      const lastUpdated = $(children[1]).text();
      const seeders = $(children[2]).text();
      const leechers = $(children[3]).text();
      const size = $(children[4]).text();
      const magnetLink = $(children[5]).children("a").attr("href");

      torrents.push({
        title,
        lastUpdated,
        seeders,
        leechers,
        size,
        magnetLink
      })
    });
  }

  return torrents;
}

export default torrentSearch;