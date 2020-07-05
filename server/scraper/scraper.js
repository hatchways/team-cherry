const {redditScraper, twitterScraper} = require('../crawlers');

module.exports = function ScraperManager() {
  this.run = async function run(companyName) {
    const date = new Date(Date.now());
    console.log(`Scraper is running: ${date.toString()} `);

    let results = [];

    const dummyData = [
      {
        image: '/imgs/reddit_icon.png',
        title:
            '"The Mask Of Zorro" was one of the last and best of the "Charming Swashbuckling Rogue Lead" movies.',
        popularity: 15154,
        content: undefined,
        date: 1593896200,
        platform: 'Reddit',
      },
      {
        image: '/imgs/reddit_icon.png',
        title:
            'If the frosting on your cupcake is taller than the cupcake itself, that\'s too much frosting.',
        popularity: 16226,
        content: undefined,
        date: 1593900124,
        platform: 'Reddit',
      },
      {
        image: '/imgs/reddit_icon.png',
        title:
            'This day last year, I rang a bell signifying the fact that chemotherapy is over.',
        popularity: 21956,
        content: undefined,
        date: 1593902996,
        platform: 'Reddit',
      },
      {
        image: '/imgs/twitter_icon.png',
        title: '',
        popularity: 5,
        content:
            'What a hilarious coincidence. My final boss today to hit legend... his name was.... "Legend" lmfao. Threw me so far off I took a screenshot of the wrong screen �#Hearthstone https://t.co/VBLzCOzOnN',
        date: 1593904296000,
        platform: 'Twitter'
      },
      {
        image: '/imgs/twitter_icon.png',
        title: '',
        popularity: 1,
        content:
            'Tempo Storm severs ties with ZeRo following admission of sexual misconduct #eSport #Dota2 #CSGO #PUBG #Hearthstone #Fortnite #videogames\nhttps://t.co/AuysuhUMpE https://t.co/w7GFjy9aTT',
        date: 1593903603000,
        platform: 'Twitter'
      },
      {
        image: '/imgs/twitter_icon.png',
        title: '',
        popularity: 6,
        content:
            '[WILD] Check out: Linecracker Druid by @ZeddyHS.\n@ZeddyHS reached #39 Legend with this list\n\n▼ Deck Code and more:\nhttps://t.co/DFXOoercl6\n\n#Hearthstone #AshesofOutland #WildHS https://t.co/YuxcF1cEWx',
        date: 1593903600000,
        platform: 'Twitter'
      },
      {
        image: '/imgs/twitter_icon.png',
        title: '',
        popularity: 2,
        content:
            'This would be groundbreaking in a totem shaman deck, what are guys thoughts????\n#hearthstone #blizzard #gaming #gamer #blizzardentertainment #games #hs @ El Paso, Texas https://t.co/AIh3SUOP99',
        date: 1593903311000,
        platform: 'Twitter'
      },
      {
        image: '/imgs/twitter_icon.png',
        title: '',
        popularity: 2,
        content:
            '[WILD] Check out: Togwaggle Druid by @HIJO_HS.\n@HIJO_HS reached #1 Legend with this list\n\n▼ Deck Code and more:\nhttps://t.co/SGtWjFtZN4\n\n#Hearthstone #AshesofOutland #WildHS https://t.co/VxLKfWlux2',
        date: 1593902400000,
        platform: 'Twitter'
      },
      {
        image: '/imgs/twitter_icon.png',
        title: '',
        popularity: 0,
        content:
            'Tomorrow\'s video, scheduled for 4pm tomorrow, UK time.\nLuciouss\' Renolock - ft. Sir Finley &amp; Grizzled Wizard!!\nhttps://t.co/XQJU2s4HOU \n\n#Hearthstone #AshesOfOutland #Renolock',
        date: 1593902000000,
        platform: 'Twitter'
      },
      {
        image: '/imgs/twitter_icon.png',
        title: '',
        popularity: 4,
        content:
            'Especial sabado 12hrs Partimos con #hearthstone “LIVE" let’s rock �\n⬇️Apoya el canal aqui ⬇️\nhttps://t.co/cGn0dtNIpE —————————————\n #stream #twitch #twitchstream #irondrolex  #twitchstreamer #pcgamer #twitchtv #twitchchile #stream12h #arockandrolear #letsrock #variosjuegos #obs https://t.co/mls7LBgXjI',
        date: 1593900742000,
        platform: 'Twitter'
      }
    ];

    const redditMentions = await redditScraper(companyName);
    const twitterMentions = await twitterScraper(companyName);

    results = results.concat(redditMentions, twitterMentions, dummyData);

    return results;
  };
};
