const Command = require("../../structures/Command");

class slotsCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["bet", "gamble", "slot", "slotmachine", "sm"],
      args: "[amount:string]",
      description: "Apuesta cookies para usar con la máquina tragamonedas.",
      cooldown: 3,
    });
  }

  async run(msg, args) {
    const baseprofit = args[0];
    const emotes = ["🍒", "🍌", "💎"];
    const modifiers = [1, 2, 5];
    const finalemotes = [];
    let profit = 0;

    // Sends modifiers
    if (!args[0] || isNaN(args[0])) {
      return this.bot.embed(
        "🎰 Slots",
        "Jugar usando tragamonedas <amount>. \n" + `${emotes.map(e => `${e} valen ${modifiers[emotes.indexOf(e)]}.`).join("\n") }`,
        msg,
      );
    }

    // Prevents mass gambling
    if (args[0] > 100) return this.bot.embed("❌ Error", "No puede apostar más de ** 100 ** cookies a la vez.", msg, "error");

    // Gets the emotes
    for (let i = 0; i < 3; i++) {
      finalemotes.push(emotes[Math.floor(Math.random() * emotes.length)]);
    }

    // Applies the profit; if 2 match, apply half profit
    if (finalemotes[0] === finalemotes[1] && finalemotes[1] === finalemotes[2]) {
      profit = Math.round(baseprofit * modifiers[emotes.indexOf(finalemotes[0])]);
    } else if (finalemotes[0] === finalemotes[1] || finalemotes[1] === finalemotes[2]) {
      profit = Math.round(baseprofit * modifiers[emotes.indexOf(finalemotes[0])] / 2);
    }

    // Gets user's cookies
    const emojistring = finalemotes.join(" ");
    let economydb = await this.bot.db.table("economy").get(msg.author.id).run();
    if (!economydb) {
      economydb = {
        id: msg.author.id,
        amount: 0,
        lastclaim: 9999,
      };

      await this.bot.db.table("economy").insert(economydb).run();
    }

    // Compares amounts
    const amount = parseInt(args[0]);
    const ucookies = await this.bot.db.table("economy").get(msg.author.id).run();
    if (amount > ucookies.amount || amount < 0) return this.bot.embed("❌ Error", "No tienes suficientes cookies para apostar eso.", msg, "error");

    // Profit calculator
    profit > 0 ? economydb.amount += profit : economydb.amount -= args[0];

    // Updates DB
    economydb.amount = Math.floor(economydb.amount);
    await this.bot.db.table("economy").get(msg.author.id).update(economydb).run();
    this.bot.embed(
      "🎰 Slots",
      `${profit ? `Ganaste **${profit}** cookie${profit === 1 ? "" : "s"}.` : "¡Perdiste! Mejor suerte la próxima vez."} \n` + `${emojistring}`,
      msg,
    );
  }
}

module.exports = slotsCommand;
