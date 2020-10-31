const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class holdhandsCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["handhold"],
      args: "<member:member>",
      description: "Se toma de la mano con otro miembro.",
      cooldown: 3,
    });
  }

  async run(msg, args, pargs) {
    const body = await fetch("https://api.weeb.sh/images/random?type=handholding", {
      headers: {
        "Authorization": `Wolke ${this.bot.key.weebsh}`,
        "User-Agent": `${this.bot.user.username}/${this.bot.version}`,
      },
    }).then(res => res.json().catch(() => {}));

    let image;
    if (body.status !== 200) image = "https://cdn.weeb.sh/images/Sky0l65WM.gif";
    else if (body.status === 200) image = body.url;

    msg.channel.createMessage({
      embed: {
        description: `👀 **${msg.author.username}** se esta tomando de la mano con **${pargs[0].value.username}**!`,
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

module.exports = holdhandsCommand;
