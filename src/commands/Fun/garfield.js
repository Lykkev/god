const Command = require("../../structures/Command");

class garfieldCommand extends Command {
  constructor(...args) {
    super(...args, {
      args: "[today:string]",
      description: "Envía un cómic de Garfield al azar.",
      allowdms: true,
      cooldown: 3,
    });
  }

  run(msg, args) {
    // Gets a random comic
    function GarfieldRandom(latest = false) {
      const days = 24 * 60 * 60 * 1000;
      const today = new Date();
      const start = new Date("1978/06/19");
      let date;
      if (latest) date = new Date();
      else date = new Date(start.getTime() + Math.random() * (today.getTime() - start));

      // Gets total amount of comics
      const total = Math.round(Math.abs((start.getTime() - today.getTime()) / (days)));

      // Gets image URL
      function pad(n) { return n < 10 ? `0${n}` : n; }
      const archive = "https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/";
      const url = `${archive + date.getUTCFullYear()}/${date.getUTCFullYear()}-${pad(date.getUTCMonth())}-${pad(date.getUTCDate())}.gif`;
      const garfield = [url, date.getUTCFullYear(), pad(date.getUTCMonth()), pad(date.getUTCDate()), total];
      return garfield;
    }

    const garfield = GarfieldRandom(args.map(a => a.toLowerCase()).includes("today"));
    if (!garfield[0]) return this.bot.embed("❌ Error", "No se pudo enviar el cómic. Vuelve a intentarlo más tarde.", msg, "error");

    msg.channel.createMessage({
      embed: {
        title: `💭 Publicado el ${garfield[1]}-${garfield[2]}-${garfield[3]}`,
        color: this.bot.embed.color("general"),
        image: {
          url: garfield[0],
        },
        footer: {
          text: `Pedido por ${this.bot.tag(msg.author)} | ${garfield[4]} total comics`,
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}

module.exports = garfieldCommand;
