import snoowrap from 'snoowrap';
import chalk from 'chalk';
import atob from 'atob';
import btoa from 'btoa';

const splitLines = (str: string): string[] => str.split(/\r?\n/);

const isUrl = (string: string) => {
  let url: URL;
  
  try {
    url = new URL(string);
  } catch {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const redditSearch = async (query: string) => {

  const r = new snoowrap({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38",
    clientId: "eScAVV6ztqIHWaiYsyhiJQ",
    clientSecret: "I6UUM-PHsIMwLveBJMkkgYK3sWKRzw",
    refreshToken: "645874843348-LiokKUYh2oteTvWwKEsFH5-yYfbBIg"
  });

  const response = (await r.search({ query,  subreddit: "riprequests" })).fetchAll();

  console.log(chalk.green("Looping through all posts, please wait..."));

  response.forEach(async (submission, index) => {
    if(submission.title.includes("[SHARE]")) {
      const split = splitLines(submission.selftext);

      split.forEach((line) => {
        if(isBase64(line)) {
          const decoded = atob(line);

          if(isUrl(decoded)) {
            console.log(`Title: ${submission.title} - ${decoded}`);
          }
        }
      });

    } else {

      if(submission.num_comments > 0) {

        const resp = submission.comments.fetchAll();

        resp.forEach((comment) => {
          const split = splitLines(comment.body);

          split.forEach((line) => {
            if(isBase64(line)) {
              const decoded = atob(line);

              if(isUrl(decoded)) {
                console.log(`Title: ${submission.title} - ${decoded}`);
              }
            }
          });
        });
      }
    }
  });
}

const isBase64 = (str: string) => {
  if (str === '' || str.trim() === ''){ return false; }
  try {
      return btoa(atob(str)) == str;
  } catch (err) {
      return false;
  }
}

export default redditSearch;