module.exports.run = async (client, config) => {
  client.user.setStatus('online');
  if (config.env.get('inDev')) {
    client.user.setActivity('with the Testaccount from Flipper');
  } else {
    setInterval(() => {
      setTimeout(() => {
        client.user.setActivity(`${client.guilds.cache.size} servers.`, { type: 'LISTENING' });
      }, 20000);
      client.user.setActivity('with \'+help\' command');
    }, 1 * 40000);
  }
  await console.log(`[${module.exports.help.name}] Set status!`);
};

module.exports.help = {
  name: 'SETUP_status',
};
