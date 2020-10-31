/**
 * @fileoverview Channel update logger
 * @description Logs when a channel is created, deleted, or modified
 * @module logger/channelUpdate
 */

const Logger = require("../structures/Logger");

module.exports = bot => {
  // Logging database
  const loggingdb = new Logger(bot.db);
  const canSend = async (guild, evchannel) => {
    if (!guild || !guild.channels) return;
    const canLog = await loggingdb.canLog(guild);
    if (!canLog) return;
    // Sets type
    const channel = await loggingdb.guildLogging(guild, "eventLogging", evchannel);
    if (guild.channels.has(channel)) return channel;
  };

  // Logs when a channel is created
  bot.on("channelCreate", async channel => {
    // Finds channel; returns if it shouldn't log
    if (channel.type === 1 || channel.type === 3) return;
    const logchannel = await canSend(channel.guild, "channelCreate", channel.id);
    if (!logchannel) return;
    const embed = {
      color: bot.embed.color("general"),
      description: `<#${channel.id}> (${channel.id})`,
      author: {
        name: `#${channel.name} creado`,
      },
    };

    // Reads the audit logs
    const logs = await channel.guild.getAuditLogs(1, null, 10).catch(() => {});
    if (logs) {
      const log = logs.entries[0];
      const user = logs.users[0];
      // Adds to the embed
      if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
        embed.author.name = `${bot.tag(user)} creó el canal.`;
        embed.author.icon_url = user.avatarURL;
      }
    }

    bot.createMessage(logchannel, { embed: embed }).catch(() => {});
  });

  // Logs when a channel is deleted
  bot.on("channelDelete", async channel => {
    // Finds channel; returns if it shouldn't log
    if (channel.type === 1 || channel.type === 3) return;
    const logchannel = await canSend(channel.guild, "channelCreate");
    if (!logchannel) return;
    const embed = {
      color: bot.embed.color("error"),
      description: `**ID:** ${channel.id}`,
      author: {
        name: `#${channel.name} eliminado`,
      },
    };

    // Reads the audit logs
    const logs = await channel.guild.getAuditLogs(1, null, 12).catch(() => {});
    if (logs) {
      const log = logs.entries[0];
      const user = logs.users[0];
      // Adds to the embed
      if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
        embed.author.name = `${bot.tag(user)} eliminó #${channel.name}.`;
        embed.author.icon_url = user.avatarURL;
      }
    }

    bot.createMessage(logchannel, { embed: embed }).catch(() => {});
  });

  // Logs when a channel is edited
  bot.on("channelUpdate", async (channel, oldchannel) => {
    // Finds channel; returns if it shouldn't log
    if (channel.type === 1 || channel.type === 3) return;
    const logchannel = await canSend(channel.guild, "channelUpdate");
    if (!logchannel) return;
    const embed = {
      color: bot.embed.color("general"),
      author: {
        name: `#${oldchannel.name} actualizado`,
      },
      fields: [],
    };

    // Channel name differences
    if (channel.name !== oldchannel.name) {
      embed.fields.push({
        name: "Nombre",
        value: `${oldchannel.name} ➜ ${channel.name}`,
      });
    }

    // Topic differences
    if (channel.topic !== oldchannel.topic) {
      embed.fields.push({
        name: "Tema",
        value: `${oldchannel.topic} ➜ ${channel.topic}`,
      });
    }

    // NSFW differences
    if (channel.nsfw !== oldchannel.nsfw) {
      embed.fields.push({
        name: "NSFW",
        value: `${channel.nsfw ? "Activado" : "Desactivado"} ➜ ${oldchannel.nsfw ? "Activado" : "Desactivado"}`,
      });
    }

    // Bitrate differences
    if (channel.bitrate && channel.bitrate !== oldchannel.bitrate) {
      embed.fields.push({
        name: "Bitrate",
        value: `${oldchannel.bitrate} ➜ ${channel.bitrate}`,
      });
    }

    // Slowmode differences
    if (channel.rateLimitPerUser !== oldchannel.rateLimitPerUser) {
      embed.fields.push({
        name: "Slowmode",
        value: `${oldchannel.rateLimitPerUser === 0 ? "Sin cooldown" : `${oldchannel.rateLimitPerUser} segundos`} ➜ ${channel.rateLimitPerUser === 0 ?
          "Sin cooldown" : `${channel.rateLimitPerUser} segundos`}`,
      });
    }

    // Reads the audit logs
    if (!embed.fields.length) return;
    const logs = await channel.guild.getAuditLogs(1, null, 11).catch(() => {});
    if (logs) {
      // Updates embed if needed
      const log = logs.entries[0];
      const user = logs.users[0];
      if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
        embed.author.name = `${bot.tag(user)} editó #${oldchannel.name}.`;
        embed.author.icon_url = user.avatarURL;
      }
    }

    bot.createMessage(logchannel, { embed: embed }).catch(() => {});
  });
};
