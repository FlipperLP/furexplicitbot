const config = require('../config/main.json');

const servertagsblacklist = require('../database/models/servertagsblacklist');

async function getTags(serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.managementServerID] }, order: [['tag', 'ASC']] });
  return result;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  const DBentries = await getTags(message.guild.id);
  const blacklistedTags = [];
  DBentries.forEach((entry) => {
    blacklistedTags.push(entry.tag);
  });
  const embed = new MessageEmbed()
    .setColor(message.member.displayColor)
    .setAuthor('Blacklisted tagws in thwis serwer:')
    .setDescription(`\`\`\`${blacklistedTags.join(', ')}\`\`\``);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'CMD_blacklist_list',
  parent: 'blacklist',
};
