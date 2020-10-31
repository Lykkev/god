const Command = require("../../structures/Command");
const format = require("../../utils/format");
const fetch = require("node-fetch");

class steamCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["steamaccount", "steaminfo", "steamuser"],
      args: "<username:string>",
      description: "Muestra información sobre una cuenta de Steam.",
      requiredkeys: ["steam"],
      cooldown: 5,
    });
  }

  async run(msg, args) {
    let steamid;
    let id;
    let profile;
    let bans;
    let games;
    let steamlvl;
    // let description;

    // Vanity URL checker
    if (/^\d+$/.test(args[0])) steamid = args[0];
    else if (args.join(" ").startsWith("https://steamcommunity.com/id/")) args[0] = args.join(" ")
      .substring("https://steamcommunity.com/id/".length, args.join(" ").length);

    if (!steamid) {
      id = await fetch(
        `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${this.bot.key.steam}&vanityurl=${encodeURIComponent(args[0])}`,
      ).then(res => res.json().catch(() => {}));

      if (!id || id.response.success !== 1) {
        return this.bot.embed("❌ Error", "Cuenta no encontrada.", msg, "error");
      }

      steamid = id.response.steamid;
    }

    // Gets summary info
    const steamsg = await this.bot.embed("🎮 Steam", "Esperando una respuesta de Steam...", msg);
    profile = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.bot.key.steam}&steamids=${steamid}`,
    ).then(res => res.json().catch(() => {}));
    profile = profile.response.players[0];

    // Gets ban info
    bans = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${this.bot.key.steam}&steamids=${steamid}`,
    ).then(res => res.json().catch(() => {}));
    bans = bans.players[0];

    // Gets owned games
    games = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?steamid=${steamid}&include_appinfo=1&include_played_free_games=1&key=${this.bot.key.steam}`,
    ).then(res => res.json().catch(() => {}));
    games = games.response;

    // Gets steam level
    steamlvl = await fetch(
      `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?steamid=${steamid}&key=${this.bot.key.steam}`,
    ).then(res => res.json().catch(() => {}));
    steamlvl = steamlvl.response.player_level;

    // // Gets bio
    // description = await fetch(`http://steamcommunity.com/profiles/${steamid}`).then(res => res.text().catch(() => {}));
    // description = /<meta name="description">[\s\n]{0,}([\w\d\s;_\-,.]{0,512})/.exec(description);

    // console.log(description);
    // if (description) description = description[1];
    // if (!description || description === "No information given.") description = null;
    // if (description && description.length > 256) description = `${description.substring(0, 256)}...`;
    if (!profile || !bans || !games) return this.bot.embed("❌ Error", "Cuenta no encontrada.", msg, "error");

    // Formats statuses
    if (profile.personastate === 0) profile.personastate = "Offline/Invisible";
    if (profile.personastate === 1) profile.personastate = "Online";
    if (profile.personastate === 2) profile.personastate = "Busy";
    if (profile.personastate === 3) profile.personastate = "Away";
    if (profile.personastate === 4) profile.personastate = "Snooze";
    if (profile.personastate === 5) profile.personastate = "Looking to trade";
    if (profile.personastate === 6) profile.personastate = "Looking to play";

    const fieldsConstruct = [{
      name: "ID",
      value: profile.steamid,
      inline: true,
    }, {
      name: "Nombre para mostrar",
      value: profile.personaname,
      inline: true,
    }, {
      name: "Visibilidad",
      value: profile.personastate || "Private",
      inline: true,
    }, {
      name: "Jugando",
      value: `${profile.gameid ? games.games.find(game => game.appid === profile.gameid).name : "None/Private"}`,
      inline: true,
    }, {
      name: "Juegos en propiedad",
      value: games.game_count || "Private",
      inline: true,
    }, {
      name: "Nivel",
      value: steamlvl || "0",
      inline: true,
    }, {
      name: "Fecha de creación",
      value: profile.timecreated ? format.date(profile.timecreated * 1000) : "Unknown",
      inline: true,
    }, {
      name: "Última conexión",
      value: profile.lastlogoff !== undefined ? `${format.dateParse(new Date() / 1000 - profile.lastlogoff)} ago` : "Unknown",
      inline: true,
    }];

    if (profile.loccountrycode) fieldsConstruct.push({
      name: "País",
      value: `:flag_${profile.loccountrycode.toLowerCase()}:` || "Unknown",
      inline: true,
    });

    if (profile.realname) fieldsConstruct.push({
      name: "Nombre real",
      value: profile.realname,
      inline: true,
    });

    let banstring = "";
    if (bans.NumberOfVACBans > 0 || bans.NumberOfGameBans > 0 || bans.EconomyBan !== "none") {
      if (bans.NumberOfVACBans > 0) banstring += `✅ ${bans.NumberOfVACBans} VAC Ban${bans.NumberOfVACBans > 1 ? "s" : ""}\n`;
      else banstring += "❌ 0 VAC Bans\n";
      if (bans.NumberOfGameBans > 0) banstring += `✅ ${bans.NumberOfGameBans} Game Ban${bans.NumberOfGameBans > 1 ? "s" : ""}\n`;
      else banstring += "❌ 0 Game Bans\n";
      if (bans.EconomyBan !== "none") banstring += `✅ Estado de prohibición comercial: ${bans.EconomyBan}\n`;
      else banstring += "❌ Not trade banned\n";
    }

    if (banstring.length) fieldsConstruct.push({
      name: "Ban Status",
      value: banstring,
      inline: false,
    });

    steamsg.edit({
      embed: {
        // description: description,
        color: 0x66C0F4,
        fields: fieldsConstruct,
        author: {
          name: profile.personaname,
          icon_url: profile.avatarfull,
          url: `https://steamcommunity.com/profiles/${profile.steamid}`,
        },
        thumbnail: {
          url: profile.avatarfull,
        },
        footer: {
          text: `Pedido por ${this.bot.tag(msg.author)}`,
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}

module.exports = steamCommand;
