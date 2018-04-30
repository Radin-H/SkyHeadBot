const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "bitch stop looking at this";
const PREFIX = "=";

function generateHex(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var servers = {};

function play(connection, message){
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
  
  server.queue.shift();

  server.dispatcher.on("end", function(){
    if(server.queue[0]) play(connection, message);
    else connection.disconnect();
  });
}

var bot = new Discord.Client();

bot.on("ready", function(){
  console.log("Ready");
});

bot.on("guildMemberAdd", function(member){
    // member.guild.channels.find("name", "general").sendMessage(member.toString() + " welcome bitch boy")

    member.addRole(member.guild.roles.find("name", "★ Member ★"))

    var embed = new Discord.RichEmbed()
    .addField("Welcome to the Official SkyHead Discord!", "\u200b")
    .addField("\u200b", "**Links** \n Website: https://skyhead.net/ \n Store: https://store.skyhead.net/ \n Discord: https://discord.gg/vEEnSD2/")
    .addField("\u200b", "**Info** \n Server IP: play.skyhead.net \n Weekly Giveaways For Trusted \n Twitter: @skyheadmc")
    .setColor(0xFFDF00)
    member.sendMessage(embed);

});

bot.on("message", function(message){
    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()){
      case "ping":
      message.channel.send("", {
  file: "http://i0.kym-cdn.com/photos/images/original/001/318/758/bbe.png"
});
        break;
        case "info":
        message.channel.sendMessage("I'm a bot made by our lord and saviour knite/jvadi/Crust/the owner man");
        break;
        case "clear":
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
          message.channel.fetchMessages()
             .then(function(list){
                  message.channel.bulkDelete(list);
              }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})                        
      }         
        break;
        case "play":
          if(!args[1]){
            message.channel.sendMessage("Please provide a link.");
            return;
          }

          if(!message.member.voiceChannel){
            message.channel.sendMessage("Must be in a voice channel.")
            return;
          }

          if(!servers[message.guild.id])servers[message.guild.id] = {
            queue: []
          };

          var server = servers[message.guild.id];

          server.queue.push(args[1]);
          message.channel.sendMessage(message.author.toString()+" Playing...")
          if(!message.guild.voiceChannel) message.member.voiceChannel.join().then(function(connection){
            play(connection, message);
          });

        break;
        case "skip":
            var server = servers[message.guild.id];

            if(server.dispatcher) server.dispatcher.end();
            message.channel.sendMessage(message.author.toString()+" Skipped")
        break;
        case "stop":
        var server = servers[message.guild.id];

        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        message.channel.sendMessage(message.author.toString()+" Stopped")
        break;
        default:
          message.channel.sendMessage("Invalid command.");
    }
});

bot.login(TOKEN);
