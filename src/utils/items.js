module.exports = [{
    category: "Features",
    emoji: "☑",
    id: "agreeChannel",
    label: "Agree Channel",
    type: "channelID",
  }, {
    category: "Roles",
    emoji: "✔",
    id: "agreeRole",
    label: "Agree Role",
    type: "roleID",
  }, {
    category: "Automod",
    emoji: "🔗",
    id: "antiInvite",
    label: "AntiInvite",
    type: "bool",
  }, {
    category: "Automod",
    emoji: "🚯",
    id: "antiSpam",
    label: "AntiSpam",
    type: "bool",
  }, {
    id: "assignableRoles",
    label: "Assignable Roles",
    type: "roleArray",
  }, {
    category: "Roles",
    emoji: "👤",
    id: "autoRoles",
    label: "Automatic Roles",
    type: "roleArray",
    maximum: 5,
  }, {
    id: "disabledCategories",
    label: "Disabled Categories",
    type: "array",
  }, {
    id: "disabledCmds",
    label: "Disabled Commands",
    type: "array",
  }, {
    category: "Features",
    id: "easyTranslate",
    emoji: "🌍",
    label: "Easy Translate",
    type: "bool",
    description: "Automatically translate content reacted to with a flag emoji.",
  }, {
    category: "Automod",
    emoji: "⚒",
    id: "invitePunishments",
    label: "Invite Punishment",
    type: "punishment",
  }, {
    category: "Logging",
    emoji: "👋",
    id: "leaveJoin",
    label: "Leave/Join Channel",
    type: "channelID",
  }, {
    category: "Logging",
    emoji: "✉",
    id: "joinMessage",
    label: "Join Message",
    type: "string",
    minimum: 1,
    maximum: 200,
  }, {
    category: "Logging",
    emoji: "🚪",
    id: "leaveMessage",
    label: "Leave Message",
    type: "string",
    minimum: 1,
    maximum: 200,
  }, {
    category: "Logging",
    emoji: "📄",
    id: "eventLogging",
    label: "Event Logging Channel",
    type: "channelID",
  }, {
    category: "Logging",
    emoji: "📜",
    id: "messageLogging",
    label: "Message Logging Channel",
    type: "channelID",
  }, {
    category: "Logging",
    emoji: "📰",
    id: "memberLogging",
    label: "Member Logging Channel",
    type: "channelID",
  }, {
    category: "Logging",
    emoji: "📃",
    id: "modLogging",
    label: "Mod Logging Channel",
    type: "channelID",
  },
  {
    category: "Logging",
    emoji: "📵",
    id: "ignoredLoggingChannels",
    label: "Ignored Logging Channels",
    type: "channelArray",
  }, {
    category: "Automod",
    emoji: "💬",
    id: "msgOnPunishment",
    label: "Punishment Message",
    type: "bool",
  }, {
    category: "Roles",
    emoji: "🔕",
    id: "mutedRole",
    label: "Muted Role",
    type: "roleID",
  }, {
    category: "Features",
    emoji: "💣",
    id: "snipingEnable",
    label: "Message Sniping",
    type: "bool",
  }, {
    category: "Features",
    emoji: "🚫",
    id: "snipingIgnore",
    label: "Ignored Snipe Channels",
    type: "channelArray",
  }, {
    category: "Features",
    emoji: "🔗",
    id: "snipingInvites",
    label: "Invite Sniping",
    type: "bool",
  }, {
    category: "Features",
    emoji: "⛔",
    id: "snipingPermission",
    label: "Public Sniping",
    type: "bool",
  }, {
    category: "Roles",
    emoji: "🔨",
    id: "staffRole",
    label: "Staff Role",
    type: "roleID",
  }, {
    category: "Features",
    emoji: "🔢",
    id: "pinAmount",
    label: "Pin Amount",
    type: "number",
  }, {
    category: "Features",
    emoji: "📍",
    id: "pinChannel",
    label: "Pin Channel",
    type: "channelID",
  }, {
    category: "Features",
    emoji: "📌",
    id: "pinEmoji",
    label: "Pin Emoji",
    type: "emoji",
  }, {
    category: "Features",
    emoji: "🗣",
    id: "pinSelfPinning",
    label: "Self Pinning",
    type: "bool",
  }, {
    id: "prefix",
    label: "Prefix",
    type: "string",
    minimum: 1,
    maximum: 15,
  }, {
    category: "Automod",
    emoji: "🛠",
    id: "spamPunishments",
    label: "Spam Punishments",
    type: "punishment",
  }, {
    category: "Automod",
    emoji: "🔢",
    id: "spamThreshold",
    label: "Spam Threshold",
    minimum: 5,
    maximum: 10,
    type: "number",
  }, {
    category: "Roles",
    emoji: "☑",
    id: "verifiedRole",
    label: "Verified Role",
    type: "roleID",
  }, {
    category: "Profile",
    id: "bio",
    type: "string",
    minimum: 1,
    maximum: 200,
  }, {
    category: "Profile",
    id: "pronouns",
    type: "selection",
  }, {
    category: "Profile",
    id: "timezone",
    type: "autofill",
  }, {
    category: "Profile",
    id: "timezoneHide",
    type: "bool",
  },
];
