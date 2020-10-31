const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class wikipediaCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["wiki"],
      args: "<page:string>",
      description: "Devuelve información de Wikipedia.",
      allowdms: true,
      cooldown: 3,
    });
  }

  async run(msg, args) {
    const body = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args.join(" "))}`,
    ).then(res => res.json().catch(() => {}));

    if (!body) return this.bot.embed("❌ Error", "Página no encontrada. Puede ser sensible a mayúsculas y minúsculas!", msg, "error");
    if (body.title && body.title === "Not found.") return this.bot.embed("❌ Error", "Pagina no encontrada.", msg, "error");

    if (body.type === "disambiguation") {
      return this.bot.embed("🌐 Wikipedia", `[Pagina](${body.content_urls.desktop.page}) es una página de desambiguación.`, msg);
    }

    this.bot.embed(`🌐 ${body.title}`, body.extract, msg);
  }
}

module.exports = wikipediaCommand;
