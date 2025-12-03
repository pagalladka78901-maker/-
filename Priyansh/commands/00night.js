const fs = require("fs");
module.exports.config = {
  name: "night",
    version: "2.1.1",
  hasPermssion: 0,
  credits: "PRINCE RAJPUT", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = async ({ api, event, Users, Currencies, args, utils, client, global }) => {
  var name = await Users.getNameUser(event.senderID);
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("NIGHT") ||
     react.includes("night") ||
     react.includes("Night") ||
react.includes("NiGhT")) {
    var msg = {
        body: `★━━━━━━━━━━━━━★😍Good Night Guys 😒😍★━━━━━━━━━━━━━★`,attachment: fs.createReadStream(__dirname + `/noprefix/night.mp3`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😈", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = async ({ api, event, Currencies, args, utils, client, global }) => {

  }
