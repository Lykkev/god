const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class rule34Command extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["paheal", "r34"],
      args: "[tags:string]",
      description: "Envía una imagen de Rule34.",
      cooldown: 3,
      nsfw: true,
    });
  }

  async run(msg, args) {
    // Filter's specific content
    const search = args.join("").toLowerCase();
    if (search.includes("hibiki") || search.includes("loli") || search.includes("shota") || search.includes("cub")) {
      msg.channel.createMessage({
        embed: {
          title: "❌ Repugnante...",
          color: this.bot.embed.color("error"),
          image: {
            url: "https://i.imgur.com/evfz3WI.png",
          },
          footer: {
            text: `Pedido por ${this.bot.tag(msg.author)}`,
            icon_url: msg.author.dynamicAvatarURL(),
          },
        },
      });

      // Logs TOS breakers
      return this.bot.createMessage(this.bot.config.logchannel, {
        embed: {
          color: this.bot.embed.color("error"),
          author: {
            name: `${this.bot.tag(msg.author)} (${msg.author.id}) buscado por ${search} en ${this.id}`,
            icon_url: msg.author.dynamicAvatarURL(),
          },
        },
      });
    }

    const body = await fetch(`https://r34-json-api.herokuapp.com/posts?tags=${encodeURIComponent(args.join(" "))}`)
      .then(res => res.json().catch(() => {}));
    if (!body || !body[0]) return this.bot.embed("❌ Error", "No se encontraron imágenes.", msg, "error");
    const random = Math.floor(Math.random() * body.length);

    if (body[random].sample_url.endsWith(".webm") || body[random].sample_url.endsWith(".mp4")) {
      return this.bot.embed("❌ Error", `El post es un video. Puedes verlo [Aquí](${body[0].sample_url}).`, msg, "error");
    }

    msg.channel.createMessage({
      embed: {
        title: "🔞 Rule 34",
        color: 0xA8E5A2,
        image: {
          url: body[random].sample_url,
        },
        footer: {
          text: `Pedido por ${this.bot.tag(msg.author)}`,
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}

module.exports = rule34Command;
