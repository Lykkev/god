const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class mikuCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: [],
      description: "Envía una imagen de Hatsune Miku.",
      cooldown: 3,
    });
  }

  async run(msg) {
    const body = await fetch("https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=hatsune_miku%20rating:safe")
      .then(res => res.json().catch(() => {}));

    if (!body || !body[0].image || !body[0].directory) {
      return this.bot.embed("❌ Error", "No se encontraron imágenes.", msg, "error");
    }

    if (body[0].image.endsWith(".webm") || body[0].image.endsWith(".mp4")) {
      return this.bot.embed("❌ Error", `La publicación es un video. Puedes verlo [Aqui](${body[0].image}).`, msg, "error");
    }

    const random = Math.floor(Math.random() * body.length);

    msg.channel.createMessage({
      embed: {
        title: "🌸 Hatsune Miku",
        color: this.bot.embed.color("general"),
        image: {
          url: `https://safebooru.org/images/${body[random].directory}/${body[random].image}`,
        },
        footer: {
          text: `Pedido por ${this.bot.tag(msg.author)}`,
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}

module.exports = mikuCommand;
