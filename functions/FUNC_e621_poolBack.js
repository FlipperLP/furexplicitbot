function postPicture(reaction, RichEmbed, previewMessage, config, post, poolData) {
  const embed = new RichEmbed();

  const extention = post.file.ext;
  if (extention === 'webm' || extention === 'swf') {
    embed.addField('Direct video link', post.file_url);
  }

  let source = 'none';
  let typeSources = 'Sources';
  if (post.sources.length !== 0) {
    source = post.sources.join('\n');
    if (post.sources.length === 1) typeSources = 'Source';
  }

  embed
    .setColor(previewMessage.color)
    .setTitle('E621 Link')
    .setURL(`https://e621.net/posts/${ID}`)
    .addField('Pool', `https://e621.net/pools/${POOLLINK}`, true)
    .addField('Pool Index', poolData.post_ids.indexOf(POOLINDEX), true)
    .addField('Pool laste Page', poolData.post_ids.length, true)
    .addField('Full Picture link', URL)
    .setImage(URL)
    .setFooter(config.e621.label, config.e621.logo)
    .setTimestamp();
  reaction.message.edit({ embed });
}

module.exports.run = async (reaction, config, RichEmbed) => {
  // check if message is in detailed mode
  // get pool link (for re-use)
  // get embed poolname (for re-use)
  // check DB for pool entry
};

module.exports.help = {
  name: 'FUNC_e621_poolBack',
};