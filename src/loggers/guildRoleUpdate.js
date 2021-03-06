/**
 * @fileoverview Guild role update logger
 * @description Logs when a role is created, updated, or deleted.
 * @module logger/roleUpdate
 */

const Logger = require("../structures/Logger");

module.exports = bot => {
  // Logging database
  const loggingdb = new Logger(bot.db);
  const canSend = async guild => {
    if (!guild || !guild.channels) return;
    const canLog = await loggingdb.canLog(guild);
    if (!canLog) return;
    // Sets type
    const channel = await loggingdb.guildLogging(guild, "eventLogging");
    if (guild.channels.has(channel)) return channel;
  };

  // Logs when a role is created
  bot.on("guildRoleCreate", async (guild, role) => {
    const logchannel = await canSend(guild, "guildRoleCreate");
    if (!logchannel) return;
    const embed = {
      color: bot.embed.color("general"),
      description: `<@&${role.id}> (${role.id})`,
      author: {
        name: `@${role.name} creado`,
      },
    };

    // Reads the audit logs
    const logs = await guild.getAuditLogs(1, null, 30).catch(() => {});
    if (logs) {
      const log = logs.entries[0];
      const user = logs.users[0];
      // Adds to the embed
      if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
        embed.author.name = `${bot.tag(user)} creó el rol.`;
        embed.author.icon_url = user.avatarURL;
      }
    }

    bot.createMessage(logchannel, { embed: embed }).catch(() => {});
  });

  // Logs when a role is deleted
  bot.on("guildRoleDelete", async (guild, role) => {
    const logchannel = await canSend(guild, "guildRoleDelete");
    if (!logchannel) return;
    const embed = {
      color: bot.embed.color("error"),
      description: `**ID:** ${role.id}`,
      author: {
        name: `@${role.name} eliminado`,
      },
    };

    // Reads the audit logs
    const logs = await guild.getAuditLogs(1, null, 32).catch(() => {});
    if (logs) {
      const log = logs.entries[0];
      const user = logs.users[0];
      // Adds to the embed
      if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
        embed.author.name = `${bot.tag(user)} eliminó @${role.name}.`;
        embed.author.icon_url = user.avatarURL;
      }
    }

    bot.createMessage(logchannel, { embed: embed }).catch(() => {});
  });

  // Logs when a role is edited
  bot.on("guildRoleUpdate", async (guild, role, oldrole) => {
    const logchannel = await canSend(guild, "guildRoleUpdate");
    if (!logchannel) return;
    const embed = {
      color: bot.embed.color("general"),
      fields: [],
      author: {
        name: `@${oldrole.name} actualizado`,
      },
    };

    // Name difference
    if (role.name !== oldrole.name) {
      embed.fields.push({
        name: "Nombre",
        value: `${oldrole.name} ➜ ${role.name}`,
      });
    }

    // Color difference
    if (role.color !== oldrole.color) {
      embed.fields.push({
        name: "Color",
        value: `${oldrole.color ? `${parseInt(oldrole.color).toString(16)}` : "000000"} ➜ ${role.color ? `${parseInt(role.color).toString(16)}` : "000000"}`,
      });
      embed.color = role.color;
    }

    // Hoist difference
    if (role.hoist !== undefined && oldrole.hoist !== undefined && role.hoist !== oldrole.hoist) {
      embed.fields.push({
        name: "Visibilidad",
        value: role.hoist ? "No se muestra por separado ➜ Se muestra por separado" : "Se muestra por separado ➜ No se muestra por separado",
      });
    }

    // Mentionability difference
    if (role.mentionable !== oldrole.mentionable) {
      embed.fields.push({
        name: "Mencionable",
        value: role.mentionable ? "No mencionable ➜ Mencionable" : "Mencionable ➜ No mencionable",
      });
    }

    // Reads the audit logs
    if (!embed.fields.length) return;
    const logs = await guild.getAuditLogs(1, null, 31).catch(() => {});
    if (logs) {
      const log = logs.entries[0];
      const user = logs.users[0];
      // Adds to the embed
      if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
        embed.author.name = `${bot.tag(user)} actualizó @${role.name}.`;
        embed.author.icon_url = user.avatarURL;
      }
    }

    bot.createMessage(logchannel, { embed: embed }).catch(() => {});
  });
};
