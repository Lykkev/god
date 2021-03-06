const Command = require("../../structures/Command");
const fetch = require("node-fetch");

class ipinfoCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["aboutip", "geolocation", "ip", "ipinformation"],
      args: "<ip:string>",
      description: "Devuelve información sobre una dirección IP.",
      requiredkeys: ["ipinfo"],
      cooldown: 3,
    });
  }

  async run(msg, args) {
    const body = await fetch(
      `https://ipinfo.io/${encodeURIComponent(args.join(" "))}/json?token=${encodeURIComponent(this.bot.key.ipinfo)}`,
    ).then(res => res.json().catch(() => {}));

    const abuseinfo = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(args.join(" "))}`, {
      headers: {
        "Key": this.bot.key.abuseipdb,
        "Accept": "application/json",
        "User-Agent": `${this.bot.user.username}/${this.bot.version}`,
      },
    }).then(res => res.json().catch(() => {}));

    if (body.error || !body.ip || !body.org) return this.bot.embed("❌ Error", "Dirección IP invalida.", msg, "error");

    const fields = [];
    if (body.hostname) fields.push({ name: "Nombre del host", value: body.hostname, inline: true });
    if (body.org) fields.push({ name: "Org", value: body.org, inline: true });
    if (body.loc) fields.push({ name: "Ubicación", value: body.loc, inline: true });
    if (body.country) fields.push({ name: "País", value: body.country, inline: true });
    if (body.city) fields.push({ name: "Ciudad", value: body.city, inline: true });
    if (body.region) fields.push({ name: "Region", value: body.region, inline: true });

    if (!abuseinfo.errors) fields.push({
      name: "Abuse Info",
      value: `${abuseinfo.data.totalReports} reports; ${abuseinfo.data.abuseConfidenceScore}%`,
    });

    const construct = {
      title: `🌐 ${body.ip}`,
      description: "La información puede ser ligeramente inexacta.",
      color: this.bot.embed.color("general"),
      fields: fields,
      footer: {
        text: `Pedido por ${this.bot.tag(msg.author)}`,
        icon_url: msg.author.dynamicAvatarURL(),
      },
    };

    if (body.loc && this.bot.key.maps) {
      construct.image = {
        url: `https://maps.googleapis.com/maps/api/staticmap?center=${body.loc}&zoom=10&size=250x150&sensor=false&key=${this.bot.key.maps}`,
      };
    }

    msg.channel.createMessage({
      embed: construct,
    });
  }
}

module.exports = ipinfoCommand;
