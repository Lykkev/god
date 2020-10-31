const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class kissCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["smooch"],
      args: "<member:member>",
      description: "Besa a un miembro.",
      cooldown: 3,
    });
  }

  async run(msg, args, pargs) {
    const body = await fetch("https://api.weeb.sh/images/random?type=kiss", {
      headers: {
        "Authorization": `Wolke ${this.bot.key.weebsh}`,
        "User-Agent": `${this.bot.user.username}/${this.bot.version}`,
      },
    }).then(res => res.json().catch(() => {}));

    let image;
    if (body.status !== 200) image = "https://cdn.weeb.sh/images/rkM4nTOPb.gif";
    else if (body.status === 200) image = body.url;

    msg.channel.createMessage({
      embed: {
        description: `💙 **${msg.author.username}** besó a **${pargs[0].value.username}**!`,
        color: this.bot.embed.color("general"),
        image: {
          url: image,
        },
        footer: {
          text: `Pedido por ${this.bot.tag(msg.author)}`,
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}

module.exports = kissCommand;
