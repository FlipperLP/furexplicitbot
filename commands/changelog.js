const fs = require('fs');

const version = require('../package.json');

module.exports.run = async (client, message, args, config, MessageEmbed, messageOwner, fa_token_A, fa_token_B) => {
  fs.readFile('./changelog.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      message.react('❌');
      return;
    }
    message.channel.send(`My current version iws \`${version.version}\``);
    message.channel.send(data);
  });
};

module.exports.help = {
  name: 'changelog',
  title: 'Changelog',
  desc: 'Gwet the recent changes.',
};
