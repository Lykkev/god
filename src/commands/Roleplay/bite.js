const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class biteCommand extends Command {
  constructor(...args) {
    super(...args, {
      args: "<member:member>",
      description: "Muerde a un miembro.",
      cooldown: 3,
    });
  }

  async run(msg, args, pargs) {
    const body = await fetch("https://api.weeb.sh/images/random?type=bite", {
      headers: {
        "Authorization": `Wolke ${this.bot.key.weebsh}`,
        "User-Agent": `${this.bot.user.username}/${this.bot.version}`,
      },
    }).then(res => res.json().catch(() => {}));

    let image;
    if (body.status !== 200) image = "https://cdn.weeb.sh/images/ry3pQGraW.gif";
    else if (body.status === 200) image = body.url;

    msg.channel.createMessage({
      embed: {
        description: `♥ **${msg.author.username}** mordió a **${pargs[0].value.username}**!`,
        color: this.bot.embed.color("general"),
        image: {
          url: image,
        },
        footer: {
          icon_url: this.bot.user.dynamicAvatarURL(),
          text: `Pedido por ${this.bot.tag(msg.author)} `,
        },
      },
    });
  }
}

module.exports = biteCommand;
