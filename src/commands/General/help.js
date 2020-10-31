const Command = require("../../structures/Command");
const eris = require("eris");

class helpCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["commands", "h", "listcommands"],
      args: "[command:string]",
      description: "Envía una lista de comandos o información sobre un comando específico.",
      allowdisable: false,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Formats categories
    function formatCategory(category) {
      let label;
      switch (category) {
        case "Fun":
          label = "🎉 **Comandos divertidos**";
          break;
        case "General":
          label = "🤖 **Comandos Generales**";
          break;
        case "Miscellaneous":
          label = "✨ **Comandos Diversos**";
          break;
        case "Moderation":
          label = "🔨 **Comandos de MOD**";
          break;
        case "NSFW":
          label = "🔞 **Comandos de NSFW **";
          break;
        case "Owner":
          label = "⛔ **Comandos del Owner**";
          break;
        case "Roleplay":
          label = "️️️❤️ **Comandos de Roleplay**";
          break;
        case "Utilities":
          label = "🔧 **Comandos Utiles**";
          break;
        default:
          label = "❓ **Comandos sin Categoria**";
          break;
      }
      return label;
    }

    // Finds a command
    let cmd;
    if (args) cmd = this.bot.commands.find(c => c.id.toLowerCase() === args.join(" ").toLowerCase() ||
      c.aliases.includes(args.join(" ").toLowerCase()));

    // If no command, send a list of commands
    if (!cmd) {
      let db;
      if (msg.channel.type !== 1) db = await this.bot.db.table("guildconfig").get(msg.channel.guild.id).run();
      let categories = [];

      // Hides owner & disabled cmds
      this.bot.commands.forEach(c => { if (!categories.includes(c.category) && c.category !== "Owner") categories.push(c.category); });
      if (db && db.disabledCategories) categories = categories.filter(c => !db.disabledCategories.includes(c));
      const sortedcategories = [];

      // Sorts categories
      categories = categories.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      // Current channel help
      categories.forEach(e => { sortedcategories[categories.indexOf(e)] = formatCategory(e); });
      if (args && args.join(" ").toLowerCase() === "here") {
        return msg.channel.createMessage({
          embed: {
            color: this.bot.embed.color("general"),
            fields: categories.map(category => ({
              name: sortedcategories[categories.indexOf(category)],
              // Hides disabled commands
              value: this.bot.commands.map(c => {
                if (db && db.disabledCmds && db.disabledCmds.includes(c.id)) return;
                if (c.category !== category) return;
                return `\`${c.id}\``;
              }).join(" "),
            })),
            footer: {
              text: `Pedido por ${this.bot.tag(msg.author)} | Escribe ${db && db.prefix ? db.prefix : this.bot.config.prefixes[0]}` + "help <comando> para obtener información sobre un comando.",
              icon_url: msg.author.dynamicAvatarURL(),
            },
          },
        });
      }

      // DMs the user a list of commands
      const DMChannel = await msg.author.getDMChannel();
      const dmson = await DMChannel.createMessage({
        embed: {
          color: this.bot.embed.color("general"),
          fields: categories.map(category => ({
            name: sortedcategories[categories.indexOf(category)],
            value: this.bot.commands.map(c => {
              if (db && db.disabledCmds && db.disabledCmds.includes(c.id)) return;
              if (c.category !== category) return;
              return `\`${c.id}\``;
            }).join(" "),
          })),
          footer: {
            text: `Pedido por ${this.bot.tag(msg.author)} | Escribe ${db && db.prefix ? db.prefix : this.bot.config.prefixes[0]}` + "help <comando> para obtener información sobre un comando",
            icon_url: msg.author.dynamicAvatarURL(),
          },
        },
      }).catch(() => {
        // Sends in channel if failed
        return msg.channel.createMessage({
          embed: {
            color: this.bot.embed.color("general"),
            fields: categories.map(category => ({
              name: sortedcategories[categories.indexOf(category)],
              value: this.bot.commands.map(c => {
                if (c.category !== category) return;
                return `\`${c.id}\``;
              }).join(" "),
            })),
            footer: {
              text: `Pedido por ${this.bot.tag(msg.author)} | Escribe ${db && db.prefix ? db.prefix : this.bot.config.prefixes[0]}` + "help <comando> para obtener información sobre un comando",
              icon_url: msg.author.dynamicAvatarURL(),
            },
          },
        });
      });

      // Adds a reaction; ignores in DMs
      if (msg.channel instanceof eris.PrivateChannel) return;
      if (dmson) return msg.addReaction("📬").catch(() => {});
    } else {
      // Specific command help
      const construct = [];
      if (cmd.aliases.length) {
        construct.push({
          name: "Aliases",
          value: `${cmd.aliases.map(alias => `\`${alias}\``).join(" ")}`,
          inline: false,
        });
      }

      if (cmd.args) construct.push({ name: "Uso", value: cmd.args, inline: false });
      if (cmd.cooldown) construct.push({ name: "Cooldown", value: `${cmd.cooldown} segundos`, inline: true });

      if (cmd.clientperms && cmd.clientperms !== "embedLinks") {
        construct.push({
          name: "Permisos de bot",
          value: cmd.clientperms,
          inline: true,
        });
      }

      if (cmd.requiredperms) construct.push({ name: "Permisos requeridos", value: cmd.requiredperms, inline: true });
      if (cmd.allowdisable === false) construct.push({ name: "Permitido ser deshabilitado", value: cmd.allowdisable, inline: true });
      if (cmd.staff === true) construct.push({ name: "Staff", value: cmd.staff, inline: true });

      msg.channel.createMessage({
        embed: {
          description: cmd.description || "Sin descripción dada.",
          color: this.bot.embed.color("general"),
          fields: construct,
          author: {
            name: cmd.id,
            icon_url: this.bot.user.dynamicAvatarURL(),
          },
          footer: {
            text: `Pedido por ${this.bot.tag(msg.author)}`,
            icon_url: msg.author.dynamicAvatarURL(),
          },
        },
      });
    }
  }
}

module.exports = helpCommand;
