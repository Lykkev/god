const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class currencyCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["convert", "convertmoney"],
      args: "<amount:string> <from:string> <to:string>",
      description: "Convierte dinero de una moneda a otra",
      cooldown: 3,
    });
  }

  async run(msg, args) {
    const from = args[0];
    const base = args[1];
    const to = args[2];

    if (!from) return this.bot.embed("❌ Error", "No se proporcionó ninguna cantidad para **convertir**.", msg, "error");
    else if (!base || !isNaN(base)) return this.bot.embed("❌ Error", "No se proporcionó **moneda base**.", msg, "error");
    else if (!to) return this.bot.embed("❌ Error", "No se proporcionó ninguna cantidad para **convertir a**.", msg, "error");

    const body = await fetch(
      `https://api.exchangeratesapi.io/latest?base=${encodeURIComponent(base.toUpperCase())}&symbols=${encodeURIComponent(to.toUpperCase())}`,
    ).then(res => res.json().catch(() => {}));

    if (!body) return this.bot.embed("❌ Error", "No se pudieron enviar las tarifas. Vuelve a intentarlo más tarde.", msg, "error");
    if (body && body.error && body.error !== undefined) return this.bot.embed("❌ Error", "No conversion rates found.", msg, "error");

    this.bot.embed(
      "💱 Currency",
      `**${from} ${body.base}** es aproximadamente **${from * body.rates[to.toUpperCase()].toFixed(2)} ${to.toUpperCase()}**.`,
      msg,
    );
  }
}

module.exports = currencyCommand;
