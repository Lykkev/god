const Command = require("../../structures/Command");

class voteCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["dbl", "topgg"],
      description: "Da un enlace para votar en top.gg.",
      requiredkeys: ["topgg"],
      allowdms: true,
    });
  }

  run(msg) {
    this.bot.embed(
      "🗳 Vote",
      `Vota por **${this.bot.user.username}** en top.gg [Aquí](https://top.gg/bot/${this.bot.user.id}/vote). Cada voto te da cookies.`,
      msg,
    );
  }
}

module.exports = voteCommand;
