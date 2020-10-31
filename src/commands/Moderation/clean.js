const Command = require("../../structures/Command");

class cleanCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Elimina los últimos 10 mensajes del bot.",
      clientperms: "manageMessages",
      requiredperms: "manageMessages",
      staff: true,
    });
  }

  async run(msg) {
    // Gets the messages and filters them
    let msgs = await msg.channel.getMessages(100);
    msgs = msgs.filter(m => m.author.id === this.bot.user.id);
    msgs = msgs.map(m => m.id);
    msgs.splice(msgs.length - 10, msgs.length);
    await msg.channel.deleteMessages(msgs).catch(() => {});

    // Sends a confirmation message and deletes it quickly
    const cleanmsg = await this.bot.embed("💣 Clean", "Borré los ** últimos 10 ** mensajes míos.", msg);
    await setTimeout(() => { cleanmsg.delete().catch(() => {}); }, 2000);
  }
}

module.exports = cleanCommand;
