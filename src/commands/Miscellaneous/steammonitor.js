const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class steammonitorCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["monitor", "monitorsteam"],
      args: "[account:string]",
      description: "Supervisa una cuenta de Steam para futuras prohibiciones.",
      cooldown: 3,
    });
  }

  async run(msg, args) {
    const monitors = [];

    // List of users monitored
    const steamdb = await this.bot.db.table("steammonitor").run();
    steamdb.forEach(d => d.uid === msg.author.id ? monitors.push(d) : "");
    if (!args.length) return this.bot.embed(
      "🎮 Steam Monitor",
      `Actualmente monitoreando: ${monitors.length > 0 ? monitors.map(m => `\`${m.uname}\``).join(",") : "Nadie"}`,
      msg,
    );

    let steamid;
    let id;
    let profile;
    let ban;
    if (/^\d+$/.test(args[0])) steamid = args[0];

    // If no ID, look at a vanity URL
    if (!steamid) {
      id = await fetch(
        `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${this.bot.key.steam}&vanityurl=${encodeURIComponent(args[0])}`,
      ).then(res => res.json().catch(() => {}));

      if (!id || id.response.success !== 1) return this.bot.embed("❌ Error", "Cuenta no encontrada.", msg, "error");
      steamid = id.response.steamid;
    }

    // Gets profile info
    profile = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.bot.key.steam}&steamids=${steamid}`,
    ).then(res => res.json().catch(() => {}));
    profile = profile.response.players[0];

    if (!profile || !profile.personaname) return this.bot.embed("❌ Error", "Cuenta no encontrada.", msg, "error");

    // Embed construct
    const construct = {
      id: steamid,
      uid: msg.author.id,
      pfp: profile.avatarfull,
      uname: profile.personaname,
      date: new Date(),
    };

    // Updates db
    const db = await this.bot.db.table("steammonitor").run();
    let acccount = 0;
    db.forEach(d => {
      if (d.uid === msg.author.id) acccount++;
    });

    // Only 3 accounts can be monitored at a time
    if (acccount >= 3) return this.bot.embed("❌ Error", "Solo puede monitorear 3 cuentas a la vez.", msg, "error");

    if (!db.find(d => d.id === steamid)) {
      ban = await fetch(
        `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${this.bot.key.steam}&steamids=${steamid}`,
      ).then(res => res.json().catch(() => {}));
      ban = ban.players[0];

      // If already banned
      if (ban.VACBanned || ban.NumberOfGameBans > 0) {
        return this.bot.embed(
          "❌ Error",
          `**${profile.personaname}** ya ha estado **${ban.VACBanned ? "VAC" : "game"} baneada**.`,
          msg,
          "error",
        );
      }

      // Updates db
      await this.bot.db.table("steammonitor").insert(construct).run();
      this.bot.embed("🎮 Steam Monitor", `Monitoriando **${profile.personaname}** durante los próximos 3 días.`, msg);
    } else {
      this.bot.embed("❌ Error", `**${profile.personaname}** Ya está siendo monitoreado.`, msg, "error");
    }
  }
}

module.exports = steammonitorCommand;
