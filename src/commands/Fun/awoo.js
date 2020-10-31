const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class awooCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["momiji"],
      description: "Envía una foto de Momiji Inubashiri(awoo!).",
      cooldown: 3,
    });
  }

  async run(msg) {
    const body = await fetch("https://api.weeb.sh/images/random?type=awoo", {
      headers: {
        "Authorization": `Wolke ${this.bot.key.weebsh}`,
        "User-Agent": `${this.bot.user.username}/${this.bot.version}`,
      },
    }).then(res => res.json().catch(() => {}));

    let image;
    if (body.status !== 200) image = "https://cdn.weeb.sh/images/H1Kvalk9W.png";
    else if (body.status === 200) image = body.url;

    msg.channel.createMessage({
      embed: {
        title: "🐺 Awoo!",
        color: this.bot.embed.color("general"),
        image: {
          url: image,
        },
        footer: {
          text: `Pedido por ${this.bot.tag(msg.author)} `,
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}

module.exports = awooCommand;
