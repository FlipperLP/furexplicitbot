const config = require('../config/main.json');

const autopostchannel = require('../database/models/autopostchannel');

const servertagsblacklist = require('../database/models/servertagsblacklist');

async function getChannels(serverID) {
  const result = await autopostchannel.findAll({ where: { serverID } });
  return result;
}

async function getBlacklistedTags(serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.managementServerID] } });
  return result;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  const DBentries = await getChannels(message.guild.id);
  const embed = new MessageEmbed();
  const blacklistedTagsArray = await getBlacklistedTags(message.guild.serverID);
  const suffix = [];
  blacklistedTagsArray.map((entry) => suffix.push(`-${entry.tag}`));
  await DBentries.forEach(async (entry) => {
    const channel = await client.channels.cache.find((channel) => channel.id === entry.channelID);
    embed.addField(`'#${channel.name}' - ${entry.interval}ms`, `${entry.tags} ${suffix.join(' ')}`, false);
  });
  embed
    .setColor(message.member.displayColor)
    .setAuthor('Autopost channels in this server:');
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'CMD_autopost_list',
  parent: 'autopost',
};
