const config = require('../config/main.json');

const postcache = require('../database/models/postcache');

const servertagsblacklist = require('../database/models/servertagsblacklist');

const errHander = (err) => { console.error('ERROR:', err); };

async function getBlacklistedTags(serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.managementServerID] } });
  return result;
}

function getEndpoint(nsfw, config) {
  let uri = config.e621.endpoint.sfw;
  if (nsfw) uri = config.e621.endpoint.nsfw;
  return uri;
}

function buildRequest(uri) {
  const version = require('../package.json');
  return {
    method: 'GET',
    uri,
    headers: { 'User-Agent': `FurExplicitBot/${version.version} by Flipper on e621` },
    json: true,
  };
}

async function getRequest(request) {
  const rp = require('request-promise');
  const pics = await rp(request);
  return pics.posts;
}

async function requestPictures(config, nsfw, tags) {
  const endpoint = getEndpoint(nsfw, config);
  const uri = `${endpoint}?tags=${tags} order:random&limit=${config.e621.autopost.maxCache}&login=${config.env.get('e621_login')}&api_key=${config.env.get('e621_api_key')}`;
  const posts = await getRequest(buildRequest(uri));
  return posts;
}

async function getPicture(channelID) {
  const result = await postcache.findOne({ where: { channelID } }).catch(errHander);
  if (!result) return null;
  await postcache.destroy({ where: { ID: result.ID } }).catch(errHander);
  return result;
}

async function storePictures(channelID, pool) {
  await pool.forEach((post) => {
    if (post.tags.artist[0] === null || post.file.url === null || post.id === null) return;
    postcache.findOrCreate({
      where: { channelID, postID: post.id },
      defaults: { artist: post.tags.artist[0], directLink: post.file.url },
    }).catch(errHander);
  });
}

module.exports.run = async (tags, serverID, channelID, nsfw) => {
  let post = await getPicture(channelID);
  if (!post) {
    // get blacklisted tags to add to the request
    const blacklistedTagsArray = await getBlacklistedTags(serverID);
    const suffix = [];
    blacklistedTagsArray.map((entry) => suffix.push(`-${entry.tag}`));
    // store requested pics
    await storePictures(channelID, await requestPictures(config, nsfw, `${tags} ${suffix.join(' ')}`));
    // get first pic
    post = await getPicture(channelID);
  }
  return post;
};

module.exports.help = {
  name: 'FUNC_autopostGetPictures',
};
