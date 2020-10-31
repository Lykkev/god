const { inspect } = require("util");

const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class stealembedCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Envía los datos richembed de un mensaje.",
    });
  }

  async run(msg, args) {
    // Looks for the message
    const message = await msg.channel.getMessage(args.join("")).catch(() => {});
    if (!message) return this.bot.embed("❌ Error", "Mensaje no encontrado.", msg, "error");

    // Gets the richembed
    const richembed = message.embeds.find(e => e.type === "rich");
    if (!richembed) return this.bot.embed("❌ Error", "No hay un embed en ese mensaje.", msg, "error");
    if (richembed.type) delete richembed.type;

    const body = await fetch("https://hasteb.in/documents", {
      referrer: "https://hasteb.in/",
      body: inspect(richembed),
      method: "POST",
      mode: "cors",
    }).then(res => res.json().catch(() => {}));

    if (!body || !body.key) return this.bot.embed("❌ Error", "No se pudo cargar la información del embed. Vuelve a intentarlo más tarde.", msg, "error");
    this.bot.embed("🔗 Embed ", `Puede ver el embed [Aquí](https://hasteb.in/${body.key}.js).`, msg);
  }
}

module.exports = stealembedCommand;
