const Command = require("../../structures/Command");

class inviteCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["support"],
      description: "Da enlaces para invitar al bot y para el servidor de soporte.",
      allowdms: true,
    });
  }

  run(msg) {
    this.bot.embed(
      "📌 Invite",
      `[Bot Invite](https://discord.com/oauth2/authorize?&client_id=${this.bot.user.id}&scope=bot&permissions=506850534)` +
      " • [Support Server](https://discord.gg/ezKexuF)",
      msg,
    );
  }
}

module.exports = inviteCommand;
