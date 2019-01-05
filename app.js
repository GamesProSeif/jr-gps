const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
let botData = JSON.parse(fs.readFileSync('Storage/botData.json', 'utf8'));
let wrnUsr = JSON.parse(fs.readFileSync('Storage/wrnUsr.json', 'utf8'));
let usrPoint = JSON.parse(fs.readFileSync('Storage/usrPoint.json', 'utf8'));
let ranks = JSON.parse(fs.readFileSync('Storage/ranks.json', 'utf8'));
let commands = JSON.parse(fs.readFileSync('Storage/commands.json', 'utf8'));
let bannedWords = JSON.parse(fs.readFileSync('Storage/bannedWords.json', 'utf8'));
let reportLog = JSON.parse(fs.readFileSync('Storage/reportLog.json', 'utf8'));
let prefix = botData.prefix;
let token = process.env.token; // replace with bot's token

bot.on('error', console.error);

bot.on('message', message => {

  prefix = botData.prefix;
  let sender = message.author;
  let msg = message.content.toUpperCase();
  let msgSay = message.content;
  let trueClr = 0x2ff37a;
  let errClr = 0xec4662;

  let hasAdmin;

  let cont = message.content.slice(prefix.length).split(' ');
  let args = cont.slice(1);
  let capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toString().toLowerCase();
  }

  if (sender.id == process.env.botId) return; // replace with bot's ID
  if (sender.bot) return;

  // Adding the user to user point
  if (!usrPoint[sender.id]) {
    usrPoint[sender.id] = {
      "name": sender.username,
      "id": sender.id,
      "points": 0,
      "verified": false,
      "rank": "Default",
      "messagesSent": 0,
      "sweared": 0
    }
  }

  usrPoint[sender.id].messagesSent++;

  // Profanity filter
  function alphaOnly(a) {
    var b = '';
    for (var i = 0; i < a.length; i++) {
        if (a[i] >= 'A' && a[i] <= 'z') b += a[i];
    }
    return b;
  }
  let filterMsgOne = msg
  let filterMsgTwo = filterMsgOne.replace(/_|`/g, '');
  let filterMsgThree = filterMsgTwo.split(' ');
  let filterMsg = filterMsgThree.map(a => alphaOnly(a));
  for (let k = 0; k < bannedWords.length; k++) {
    if (msg.startsWith(`${prefix}BAN-WORD`)) break;
    if (botData.banWordCondition == false) break;
    for (let p = 0; p < filterMsg.length; p++) {
      if (filterMsg[p].toUpperCase() == bannedWords[k].toUpperCase()) {
        usrPoint[sender.id].sweared++;
        message.delete();
        fs.writeFile('Storage/usrPoint.json', JSON.stringify(usrPoint), (err) => {
          if (err) console.error(err);
        });
        return;
      }
    }
  }



  // Help command
  if (msg.startsWith(prefix + 'HELP')) {

    if (msg === `${prefix}HELP`) {

      // Start of embed
      const embed = new Discord.RichEmbed()
        .setColor(trueClr)

      // Variables
      let commandsFound = 0;

      // Creating loop
      for (var cmd in commands) {

        if (commands[cmd].group.toUpperCase() === 'USER') { // Checks if the group is User
          // Counting commands
          commandsFound++
          // Adding field
          embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`);

        }

      }

      // Adding footer
      embed.setFooter('Currently showing USER commands')
      // Adding description
      embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)

      message.channel.send({embed});

    } else {

      // Variables
      let groupFound = '';

      // Creating loop
      for (var cmd in commands) {

          if (args.join(' ').trim().toUpperCase() === commands[cmd].group.toUpperCase()) {
            groupFound = commands[cmd].group.toUpperCase();
            break;
          }

        }

        if (groupFound != '') {

          // Start of embed
          const embed = new Discord.RichEmbed()
            .setColor(trueClr)

          // Variables
          let commandsFound = 0;

          for (var cmd in commands) {

            if (commands[cmd].group.toUpperCase() === groupFound) { // Gets the group specified
              // Counting commands
              commandsFound++
              // Adding field
              embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`);

            }

          }

          // Adding footer
          embed.setFooter(`Currently showing ${groupFound} commands`)
          // Adding description
          embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)

          message.channel.send({embed})

          return; // If a group is found, don't run the rest of the command

        }

        // Variables
        let commandFound = '';
        let commandDesc = '';
        let commandUsage = '';
        let commandGroup = '';

        for (var cmd in commands) {

            if (args.join(' ').trim().toUpperCase() === commands[cmd].name.toUpperCase()) {
              commandFound = commands[cmd].name;
              commandDesc = commands[cmd].desc;
              commandUsage = commands[cmd].usage;
              commandGroup = commands[cmd].group;
              break;
            }

      }

      if (commandFound === '') {
        message.channel.send({embed:{
          description:`**No command or group found titled \'${args.join(" ")}\'**`,
          color: errClr,
        }})
      }

      message.channel.send({embed:{
        title:'<> means required, [] means optional',
        color: trueClr,
        fields: [{
          name:commandFound,
          value:`**Description:** ${commandDesc}\n**Usage:** ${prefix + commandUsage}\n**Group:** ${commandGroup}`
        }],
        footer:{text:`Currently showing ${commandFound} command`}
      }});

    }

  }

  // Server command
  if (msg.startsWith(`${prefix}SERVER`)) {
    if (msg === `${prefix}SERVER`) {
      message.channel.send({embed:{
        title: 'Terraria Server Info',
        fields: [
          {
            name: 'IP',
            value: botData.server.ip,
          },
          {
            name: 'PORT',
            value: botData.server.port,
            "inline": true
          },
          {
            name: 'TERRARIA-SERVERS PAGE',
            value: "[Here](https://terraria-servers.com/server/3287/)",
          },
          {
            name: 'Vote',
            value: "[Here](https://terraria-servers.com/server/3287/vote/)",
            "inline": true
          },
        ],
        color: trueClr
      }});
    }
    if (args[0]) {
      if (args[0].toUpperCase() === 'IP') {
        message.channel.send({embed:{
          title: 'Terraria Server Info',
          fields: [
            {
              name: 'IP',
              value: botData.server.ip,
            }],
          color: trueClr
        }});
      }
      if (args[0].toUpperCase() === 'PORT') {
        message.channel.send({embed:{
          title: 'Terraria Server Info',
          fields: [
            {
              name: 'PORT',
              value: botData.server.port,
            }],
          color: trueClr
        }});
      }
      if (args[0].toUpperCase() === 'PAGE') {
        message.channel.send({embed:{
          title: 'Terraria Server Info',
          fields: [
            {
              name: 'TERRARIA-SERVER PAGE',
              value: "[Here](https://terraria-servers.com/server/3287/)",
            }],
          color: trueClr
        }});
      }
      if (args[0].toUpperCase() === 'VOTE') {
        message.channel.send({embed:{
          title: 'Terraria Server Info',
          fields: [
            {
              name: 'VOTE',
              value: "[Here](https://terraria-servers.com/server/3287/vote/)",
            }],
          color: trueClr
        }});
      }
      if (args[0].toUpperCase() === 'SET') {
        if (sender.id !== '336821533970399232') {
          message.channel.send({embed:{
            title: 'Error',
            description: 'This command is only available for the owner',
            color: errClr
          }});
          return;
        }
        if (!args[1]) {
          message.channel.send({embed:{
            title: 'Error',
            description: `Please put the required criteria\nExample: \`${prefix}server set <ip/port> <newIP/newPORT>\``,
            color: errClr
          }});
          return;
        }
        if (args[1].toUpperCase() === 'IP') {
          if (!args[2]) {
            message.channel.send({embed:{
              title: 'Error',
              description: 'Please type the new IP of the server as your arguement',
              color: errClr
            }});
            return;
          }
          let ipAddress = args[2].split('.');
          if (ipAddress.length != 4) {
            message.channel.send({embed:{
              title: `Error`,
              description: `${args[2]} is not a valid IP address`,
              color: errClr
            }});
            return;
          }
          let errFound = false;
          for (let i = 0; i < ipAddress.length; i++) {
            if (isNaN(ipAddress[i])) {
              errFound = true;
            }
          }
          if (errFound === true) {
            message.channel.send({embed:{
              title: `Error`,
              description: `${args[2]} is not a valid IP address`,
              color: errClr
            }});
            return;
          }
          for (let i = 0; i < ipAddress.length; i++) {
            if (parseFloat(ipAddress[i]) > 255) {
              errFound = true;
            }
            if (parseFloat(ipAddress[i]) < 0) {
              errFound = true;
            }
          }
          if (errFound === true) {
            message.channel.send({embed:{
              title: `Error`,
              description: `${args[2]} is not a valid IP address`,
              color: errClr
            }});
            return;
          }
          botData.server.ip = args[2];
          message.channel.send({embed:{
            title: 'Operation successful!',
            description: `IP of the Terraria server has been set to ${args[2]}`,
            color: trueClr
          }});
        }
        if (args[1].toUpperCase() === 'PORT') {
          if (!args[2]) {
            message.channel.send({embed:{
              title: 'Error',
              description: 'Please type the new PORT of the server as your arguement',
              color: errClr
            }});
            return;
          }
          if (isNaN(args[2])) {
            message.channel.send({embed:{
              title: 'Error',
              description: `${args[2]} is not a valid port`,
              color: errClr
            }});
            return;
          }
          if (args[2].length != 4) {
            message.channel.send({embed:{
              title: 'Error',
              description: `${args[2]} is not a valid port`,
              color: errClr
            }});
            return;
          }
          if (args[2].includes('.')) {
            message.channel.send({embed:{
              title: 'Error',
              description: `${args[2]} is not a valid port`,
              color: errClr
            }});
            return;
          }
          if (parseFloat(args[2]) < 0) {
            message.channel.send({embed:{
              title: 'Error',
              description: `${args[2]} is not a valid port`,
              color: errClr
            }});
            return;
          }
          botData.server.port = args[2];
          message.channel.send({embed:{
            title: 'Operation successful!',
            description: `PORT of the Terraria server has been set to ${args[2]}`,
            color: trueClr
          }});
        }
      }
    }

  }

  // Ping command
  if (msg === `${prefix}PING`) {
    message.channel.send({embed:{
      fields: [{
        name: 'Ping!',
        value: 'Pong!',
        inline: false
      },{
        name: 'Time',
        value: `${parseInt(bot.ping)} ms`,
        inline: false
      }],
      color: trueClr
    }})
  }

  // Say command
  if (msg.startsWith(`${prefix}SAY`)) {
    hasAdmin = message.member.hasPermission("ADMINISTRATOR");
    if (!hasAdmin) {
      message.channel.send({embed:{
        title:'Error',
        description:'This command is only for admins',
        color: errClr,
      }});
      return;
    }
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify your message as an arguement for `say`',
        color: errClr
      }});
      return;
    }
    message.channel.send(args.join(' '));
    message.delete();
  }

  // Report command
  if (msg.startsWith(`${prefix}REPORT`)) {
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify your report message as the arguements for the report command',
        color: errClr
      }});
      return;
    }
    if (args[0].toUpperCase() === 'DEL') {
      let reportArr = [];
      let reportFound = false;
      for (let i = 0; i < reportLog.length; i++) {
        if (reportLog[i].id === sender.id) {
          reportArr.push(reportLog[i]);
          reportFound = true;
        }
      }
      if (reportFound = false) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'No reports found from the same user',
          color: errClr
        }});
        return;
      }
      if (!reportArr[0]) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'No reports found from the same user',
          color: errClr
        }});
        return;
      }
      const filter = m => m.author.id === sender.id;
      const embed = new Discord.RichEmbed()
        .setColor(trueClr)
      embed.setTitle(`List of ${sender.username} reports`);
      embed.setDescription(`Please choose the number of the report to delete`);
      let reportsFound = 0;
      let validReports = [];
      for (let j = 0; j < reportArr.length; j++) {
        embed.addField(j + 1, reportArr[j].message);
        reportsFound++;
        validReports.push(j + 1);
      }
      embed.setFooter(`${reportsFound} reports found`);
      message.channel.send({embed});
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000
      }).then(collected => {
        let choiceMatched = false;
        let choiceNum = collected.first().content;
        for (let o = 0; o < validReports.length; o++) {
          if (choiceNum == validReports[o + 1]) choiceMatched = true;
        }
        if (choiceMatched === false) {
          message.channel.send({embed:{
            title: 'Error',
            description: `Please choose one of the numbers for the reports. Please redo the command again`,
            color: errClr
          }});
          return;
        }
        reportLog.splice(reportLog.indexOf(reportArr[parseFloat(choiceNum)]));
        message.channel.send({embed:{
          title: 'Operation successful!',
          description: `Deleted report number \`${choiceNum}\` from the report log;`,
          color: trueClr
        }});
      }).catch(err => console.log(err));
    }
    else if (args[0].toUpperCase() === 'LIST') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title:'Error',
          description:'This command is only for admins',
          color: errClr,
        }});
        return;
      }
      if (!reportLog[0]) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'There are no reports currently in the report log',
          color: errClr
        }});
        return;
      }
      const embed = new Discord.RichEmbed()
        .setColor(trueClr);
      embed.setTitle('Report Log');
      embed.setDescription('Currently showing reports in the report log')
      let reportsFound = 0;
      for (let i = 0; i < reportLog.length; i++) {
        embed.addField(`Index Number: ${i + 1}`,`**Author**: \`${reportLog[i].name}\`\n**Message**: \"${reportLog[i].message}\"`);
        reportsFound++;
      }
      embed.setFooter(`Found ${reportsFound} reports`);
      message.channel.send({embed});
    }
    else if (args[0].toUpperCase() === 'RESET') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title:'Error',
          description:'This command is only for admins',
          color: errClr,
        }});
        return;
      }
      reportLog = [];
      message.channel.send({embed:{
        title: 'Operation successful!',
        description: 'Deleted all reports from the report log',
        color: trueClr
      }});
    }
    else if (args[0].toUpperCase() === 'REMOVE') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title:'Error',
          description:'This command is only for admins',
          color: errClr,
        }});
        return;
      }
      if (!args[1]) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Please specify the index number of the report as your second arguement\nUse \`${prefix}report list\` to find out the index number of the report`,
          color: errClr
        }});
        return;
      }
      if (isNaN(args[1])) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[1]}\` is not a valid index number`,
          color: errClr
        }});
        return;
      }
      if (!reportLog[0]) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'There are no reports currently in the report log',
          color: errClr
        }});
        return;
      }
      let reportFound = false;
      let removedReport;
      for (let i = 0; i < reportLog.length; i++) {
        if (i + 1 == parseFloat(args[1])) {
          reportFound = true;
          removedReport = reportLog[i];
          reportLog.splice(i, 1);
          break;
        }
      }
      if (reportFound === false) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Couldn\'t find report with index number \`${args[1]}\``,
          color: errClr
        }});
        return;
      }
      message.channel.send({embed:{
        title: 'Operation successful!',
        description: `Removed report with index number of \`${args[1]}\` and the following details from the report log`,
        color: trueClr,
        fields: [{
          name: 'Author',
          value:  removedReport.name
        },{
          name: 'Message',
          value: removedReport.message
        }]
      }});
    }
    else if (args[0].toUpperCase() === 'HELP') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title:'Error',
          description:'This command is only for admins',
          color: errClr,
        }});
        return;
      }
      message.channel.send({embed:{
        title: 'Report Help',
        description: 'List of arguments for report command (only for admins)',
        color: trueClr,
        fields: [{
          name: 'List',
          value: `**Description**: Lists all reports in the report log\n**Usage**: \`${prefix}report list\``
        },{
          name: 'Reset',
          value: `**Description**: Resets the report log (use only when needed)\n**Usage**: \`${prefix}report reset\``
        },{
          name: 'Remove',
          value: `**Description**: Removes the specified report from the report list (requires index number of the report)\n**Usage**: \`${prefix}report remove <index number>\``
        },{
          name: 'Reply',
          value: `**Description**: Replies to the specific report author (requires index number of the report)\n**Usage**: \`${prefix}report reply <index number> <reply message>\``
        }]
      }});
    }
    else if (args[0].toUpperCase() === 'REPLY') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title:'Error',
          description:'This command is only for admins',
          color: errClr,
        }});
        return;
      }
      if (!args[1]) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Please specify the index number of the report as your second arguement\nUse \`${prefix}report list\` to find out the index number of the report`,
          color: errClr
        }});
        return;
      }
      if (isNaN(args[1])) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[1]}\` is not a valid index number`,
          color: errClr
        }});
        return;
      }
      if (!args[2]) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'Please specify your reply message as your third arguement',
          color: errClr
        }});
        return;
      }
      let reportFound = false;
      let replyReport = [];
      for (let i = 0; i < reportLog.length; i++) {
        if (parseInt(args[1]) === i + 1) {
          replyReport.push(reportLog[i]);
          reportFound = true;
          break;
        }
      }
      if (reportFound === false) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Couldn\'t find report with index number \`${args[1]}\``,
          color: errClr
        }});
        return;
      }
      let replyArr = args;
      replyArr.splice(0, 2);
      let replyMsg = replyArr.join(' ');
      bot.users.get(replyReport[0].id).send({embed:{
        author:{
          name: bot.users.get(replyReport[0].id).username,
          icon_url: bot.users.get(replyReport[0].id).avatarURL,
        },
        title: '**REPLY FOR YOUR REPORT**',
        description: `This reply has been sent to you because of what you reported`,
        color: trueClr,
        fields: [{
          name: 'Your Report Message',
          value: replyReport[0].message
        },{
          name: 'Reply Message',
          value: replyMsg
        }],
        footer: {
          text: `Reply by ${sender.username}`,
          icon_url: sender.avatarURL
        }
      }});
      message.channel.send({embed:{
        author:{
          name: sender.username,
          icon_url: sender.avatarURL,
        },
        title: 'Operation successful',
        description: `A message has been sent to __${replyReport[0].name}__ with the following details`,
        color: trueClr,
        fields: [{
          name: 'Report Message',
          value: replyReport[0].message
        },{
          name: 'Reply Message',
          value: replyMsg
        }]
      }});
      const filter = m => m.author.id === sender.id;
      message.channel.send({embed:{
        description: 'Do you wish to remove the report from the report log?\nReply with [yes/no]',
        color: trueClr
      }});
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 20000
      }).then(collected => {
        let getRemoveBoolean = (text) => {
          if (text.toUpperCase() === 'YES') return true;
          else if (text.toUpperCase() === 'NO') return false;
          else return undefined;
        }
        let removeBoolean = getRemoveBoolean(collected.first().content.toUpperCase());
        if (removeBoolean === false) {
          message.channel.send({embed:{
            title: 'Replied with \`no\`',
            description: 'The report will be kept in the report log',
            color: trueClr
          }});
        }
        else if (removeBoolean === true) {
          reportLog.splice(reportLog.indexOf(replyReport[0]), 1);
          message.channel.send({embed:{
            title: 'Replied with \`yes\`',
            description: 'The report will be removed from the report log',
            color: trueClr
          }});
        }
      }).catch(err => console.log(err));
    }
    else {
      let reportNum = 0;
      for (let i = 0; i < reportLog.length; i++) {
        if (reportLog[i].id === sender.id) {
          reportNum++;
        }
      }
      if (reportNum >= 3) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'You have already reported three times before, the report command has been disabled for you\nIf you wish to report more, please use \`/report del\` as it will delete one of your reports in the log, then try to report again.',
          color: errClr
        }});
        return;
      }
      reportLog.push({
        "id": sender.id,
        "name": sender.username,
        "message": args.join(' '),
        "order": reportLog.length + 1
      });
      message.channel.send({embed:{
      author:{
        name: sender.username,
        icon_url: sender.avatarURL,
      },
      title: 'Operation successful!',
      description: `Added your report to the report log.`,
      color: trueClr,
      fields: [{
        name: 'Author',
        value: sender.username
      },{
        name: 'Report message',
        value: args.join(' ')
      }]
    }});
    }
  }

  // screenshot command
  if (msg.startsWith(`${prefix}SS`)) {
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please choose the number of the map as your arguement',
        color: errClr
      }});
      return;
    }
    if (isNaN(args[0])) {
      message.channel.send({embed:{
        title: 'Error',
        description: `${args[0]} is not a valid number of map`,
        color: errClr
      }});
      return;
    }
    if (parseFloat(args[0]) < 1) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Please choose a number from 1 to 33 as your arguement`,
        color: errClr
      }});
      return;
    }
    if (parseFloat(args[0]) > 33) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Please choose a number from 1 to 33 as your arguement`,
        color: errClr
      }});
      return;
    }
    message.channel.send({
      files: [`./images/map (${args[0]}).png`]
    });
  }

  // ss-all
  /*if (msg === `${prefix}SC-ALL`) {
    for (let i = 1; i < 34; i++) {
      message.channel.send({
        files: [`./images/map (${i}).png`]
      });
    }
  }*/

  // Setting delete condition
  if (msg.startsWith(`${prefix}DELETEMSG`)) {
    if (sender.id !== '336821533970399232') {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Only PKZ can use this command',
        color: errClr
      }});
      return;
    };
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify `true` or `false` as your arguement',
        color: errClr
      }});
      return;
    }
    if (args.length > 1) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify only `true` or `false` as your arguement',
        color: errClr
      }});
      return;
    }

    if (args[0].toUpperCase() === 'TRUE') {
      botData.deleteCondition = true;
      message.channel.send({embed:{
        title: 'Operation successful!',
        description: `The delete condition has been set to \`${args[0].toLowerCase()}\``,
        color: trueClr
      }})
    } else if (args[0].toUpperCase() === 'FALSE') {
      botData.deleteCondition = false;
      message.channel.send({embed:{
        title: 'Operation successful!',
        description: `The delete condition has been set to \`${args[0].toLowerCase()}\``,
        color: trueClr,
      }})
    } else {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify `true` or `false` as your arguement',
        color: errClr
      }});
      return;
    }
  }

  // Deleting messages from Wilderness
  if (message.channel.parent.id === '522118918412697600') {
    if (botData.deleteCondition === false) return;
    if (sender.id === '336821533970399232') return;
    //if (sender.id === '252829167320694784') return;
    message.delete();
    if (!wrnUsr[sender.id]) {
      wrnUsr[sender.id] = {
        "name": sender.username,
        "messagesDeleted": 1,
        "warned": false
      }
    } else {
      wrnUsr[sender.id].messagesDeleted ++;
      // Warning the user
      if (wrnUsr[sender.id].warned === false) {
        if (wrnUsr[sender.id].messagesDeleted % 10 == 0) {
          bot.channels.get('515798594373025803').send({embed:{
            title: 'Alert',
            description: `User ${wrnUsr[sender.id].name} has been warned!\nReason: sending ${wrnUsr[sender.id].messagesDeleted} messages in \`Wilderness\` while development is on`,
            color: errClr
          }});
          wrnUsr[sender.id].warned = true;
        }
      }
      else {
        if (wrnUsr[sender.id].messagesDeleted % 10 == 1) {
          wrnUsr[sender.id].warned = false;
        }
      }
    }
  }

  // Broadcast command
  if (msg.startsWith(`${prefix}BC`)) {
    if (message.channel.id === '526074609112711178') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title:'Error',
          description:'This command is only for admins',
          color: errClr,
        }});
        return;
      }
      if (!args[0]) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Use \`${prefix}help bc\` for usage`,
          color: errClr
        }});
        return;
      }
      let pingCondition;
      switch (args[0].toUpperCase()) {
        case 'YES':
          pingCondition = () => {
            bot.channels.get('515798146610102275').send('@everyone');
          }
          break;
        case 'NO':
          pingCondition = () => {

          }
          break;
        default:
          message.channel.send({embed:{
            title: 'Error',
            description: `Please specify your first arguement as \`yes\` or \`no\``,
            color: errClr
          }});
          return;
          break;
      }
      if (!args[1]) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'Please specify your message',
          color: errClr
        }});
        return;
      }
      args.shift();
        bot.channels.get('515798146610102275').send({embed:{
          title: 'ANNOUNCEMENT',
          description: args.join(' '),
          color: trueClr
        }});
        pingCondition();
    } else {
      message.delete();
    }
  }

  // Prefix-set command
  if (msg.startsWith(`${prefix}PREFIX-SET`)) {
    if (sender.id != '336821533970399232') {
      message.channel.send({embed:{
        title: 'Error',
        description: 'This command is only available for the owner',
        color: errClr
      }});
      return;
    }
    if (args.length == 0) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify the new prefix as your arguement',
        color: errClr
      }});
      return;
    }
    if (args.length > 1) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'The new prefix can\'t contain whitespace',
        color: errClr
      }});
      return;
    }
    let oldPrefix = botData.prefix;
    botData.prefix = args[0];
    let newPrefix = args[0];
    message.channel.send({embed:{
      title: 'Operation successful!',
      description: `The prefix has been changed from ${oldPrefix} to ${newPrefix}`,
      color: trueClr
    }});
  }

  // ban-words commands //
  if (msg.startsWith(`${prefix}BAN-WORD`)) {
    hasAdmin = message.member.hasPermission("ADMINISTRATOR");
    if (!hasAdmin) {
      message.channel.send({embed:{
        title:'Error',
        description:'This command is only for admins',
        color: errClr,
      }});
      return;
    }
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify one of the arguements to this command',
        color: errClr
      }});
      return;
    }

    if (args[0].toUpperCase() === 'ADD') {
      if (!args[1]) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Please specify the banned word to be added\nExample: ${prefix}ban-word add <word> [word 1] [word 2] [...]`,
          color: errClr
        }});
        return;
      }
      let wordsArr = [];
      let addedWords = [];
      let errorWords = [];
      wordsArr = args.map(a => a.toUpperCase());
      wordsArr.shift();
      if (wordsArr.length === 1) {
        for (let i = 0; i < bannedWords.length; i++) {
          if (wordsArr[0].toUpperCase() === bannedWords[i].toUpperCase()) {
            message.channel.send({embed:{
              title: 'Error',
              description: `The word ${wordsArr[0]} is already there in the banned word list`,
              color: errClr
            }});
            return;
          }
        }
        bannedWords.push(wordsArr[0]);
        message.channel.send({embed:{
          title: 'Operation successful!',
          description: `The word \`${wordsArr[0]}\` has been added to the banned words list`,
          color: trueClr
        }});
      }
      else if (wordsArr.length > 1) {
        for (let i = 0; i < wordsArr.length; i++) {
          for (let j = 0; j < bannedWords.length; j++) {
            if (wordsArr[i].toUpperCase() === bannedWords[j].toUpperCase()) errorWords.push(wordsArr[i].toUpperCase());
          }
        }
        addedWords = wordsArr;
        if (errorWords[0]) {
          for (let o = 0; o < errorWords.length; o++) {
            addedWords.splice(addedWords.indexOf(errorWords[o].toUpperCase()), 1);
          }
        }
        if (addedWords[0]) {
          for (let p = 0; p < addedWords.length; p++) {
            bannedWords.push(addedWords[p]);
          }
        }
        let addMsg = addedWords[0] ? addedWords.join(' - ') : 'None';
        let errMsg = errorWords[0] ? errorWords.join(' - ') : 'None';
        message.channel.send({embed:{
          title: 'Operation log',
          description: `Trial to add words \`${wordsArr.join(' - ')}\` to the banned words list`,
          fields: [{
            name: 'Added words',
            value: `\`${addMsg}\``
          },{
            name: 'Error words',
            value: `\`${errMsg}\``
          }],
          color: trueClr
        }});
      }
    }
    else if (args[0].toUpperCase() === 'REMOVE') {
      if (!args[1]) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Please specify the banned word to be removed\nExample: ${prefix}ban-word remove <word>`,
          color: errClr
        }});
        return;
      }
      let wordFound = false;
      for (let i = 0; i < bannedWords.length; i++) {
        if (args[1].toUpperCase() === bannedWords[i].toUpperCase()) {
          wordFound = true;
        }
      }
      if (wordFound === false) {
        message.channel.send({embed:{
          title: 'Error',
          description: `The word \`${args[1]}\` is not in the banned word list`,
          color: errClr
        }});
        return;
      }
      bannedWords.splice(bannedWords.indexOf(args[1].toUpperCase()), 1);
      message.channel.send({embed:{
        title: 'Operation successful!',
        description: `The word \`${args[1]}\` was removed from the banned words list`,
        color: trueClr
      }});
    }
    else if (args[0].toUpperCase() === 'LIST') {
      let msgDesc = '';
      msgDesc = bannedWords.join(' - ');
      message.channel.send({embed:{
        title: 'Banned Words List',
        description: msgDesc.toLowerCase(),
        color: trueClr
      }});
    }
    else if (args[0].toUpperCase() === 'TOGGLE') {
      if (botData.banWordCondition == true) {
        botData.banWordCondition = false;
        message.channel.send({embed:{
          title: 'Operation successful!',
          description: 'Toggled ban word off',
          color: trueClr
        }});
      }
      else if (botData.banWordCondition == false) {
        botData.banWordCondition = true;
        message.channel.send({embed:{
          title: 'Operation successful!',
          description: 'Toggled ban word on',
          color: trueClr
        }});
      }
    }
    else if (args[0].toUpperCase() === 'HELP') {
      message.channel.send({embed:{
        title: 'Ban-word Help',
        color: trueClr,
        fields: [{
          name: 'Add',
          value: `**Description**: Adds word(s) to the banned word list\n**Usage**: \`${prefix}ban-word add <word> [word 1] [word 2] [...]\``
        },{
          name: 'Remove',
          value: `**Description**: Removes a word from the banned word list\n**Usage**: \`${prefix}ban-word remove <word>\``
        },{
          name: 'List',
          value: `**Description**: Displays the banned word list\n**Usage**: \`${prefix}ban-word list\``
        },{
          name: 'Toggle',
          value: `**Description**: Toggles deleting a message when it contains a banned word\n**Usage**: \`${prefix}ban-word toggle\``
        }]
      }});
    }
    else {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[0]}\` is not recognized as an arguement for \`ban-word\` command`,
        color: errClr
      }});
    }
  }

  // user-info command
  if (msg.startsWith(`${prefix}USER-INFO`)) {
    hasAdmin = message.member.hasPermission("ADMINISTRATOR");
    if (!args[0]) {
      if (!hasAdmin) {
        message.channel.send({embed:{
          title: 'Found user',
          description: `Details of user ${usrPoint[sender.id].name}`,
          color: trueClr,
          fields: [{
            name: 'Name',
            value: usrPoint[sender.id].name,
            inline: true
          },{
            name: 'ID',
            value: usrPoint[sender.id].id,
            inline: true
          },{
            name: 'Rank',
            value: usrPoint[sender.id].rank,
            inline: true
          },{
            name: 'Messages sent',
            value: usrPoint[sender.id].messagesSent,
            inline: true
          }]
        }});
      }
      else {
        message.channel.send({embed:{
          title: 'Found user',
          description: `Details of user ${usrPoint[sender.id].name}`,
          color: trueClr,
          fields: [{
            name: 'Name',
            value: usrPoint[sender.id].name,
            inline: true
          },{
            name: 'ID',
            value: usrPoint[sender.id].id,
            inline: true
          },{
            name: 'Rank',
            value: usrPoint[sender.id].rank,
            inline: true
          },{
            name: 'Messages sent',
            value: usrPoint[sender.id].messagesSent,
            inline: true
          },{
            name: 'Times sweared',
            value: usrPoint[sender.id].sweared,
            inline: true
          },{
            name: 'Verified?',
            value: usrPoint[sender.id].verified,
            inline: true
          }]
        }});
      }
    }
    else {
      let mentionedUsr = message.mentions.users.first();
      if (mentionedUsr != undefined) {
        if (!usrPoint[mentionedUsr.id]) {
          usrPoint[mentionedUsr.id] = {
            "name": mentionedUsr.username,
            "id": mentionedUsr.id,
            "points": 0,
            "verified": false,
            "rank": "Default",
            "messagesSent": 0,
            "sweared": 0
          }
        }
      }
      let usrqry;
      let errFound = false
      for (let user in usrPoint) {
        if (usrPoint[user].name.toUpperCase() === args[0].toUpperCase()) {
          usrqry = usrPoint[user];
          errFound = true;
          break;
        }
        else if (usrPoint[user].id == args[0]) {
          usrqry = usrPoint[user];
          errFound = true;
          break;
        }
        else if (mentionedUsr != undefined) {
          if (usrPoint[user].id == mentionedUsr.id) {
            usrqry = usrPoint[user];
            errFound = true;
            break;
          }
        }
      }
      if (errFound == false) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Couldn\'t find the user specified in the bot\'s data system\nTo add the user, please use mention user as your argument\nExample: ${prefix}user-info @GamesProSeif`,
          color: errClr
        }});
        return;
      }
      if (!hasAdmin) {
        message.channel.send({embed:{
          title: 'Found user',
          description: `Details of user ${usrqry.name}`,
          color: trueClr,
          fields: [{
            name: 'Name',
            value: usrqry.name,
            inline: true
          },{
            name: 'ID',
            value: usrqry.id,
            inline: true
          },{
            name: 'Rank',
            value: usrqry.rank,
            inline: true
          },{
            name: 'Messages sent',
            value: usrqry.messagesSent,
            inline: true
          }]
        }});
      }
      else {
        message.channel.send({embed:{
          title: 'Found user',
          description: `Details of user ${usrqry.name}`,
          color: trueClr,
          fields: [{
            name: 'Name',
            value: usrqry.name,
            inline: true
          },{
            name: 'ID',
            value: usrqry.id,
            inline: true
          },{
            name: 'Rank',
            value: usrqry.rank,
            inline: true
          },{
            name: 'Messages sent',
            value: usrqry.messagesSent,
            inline: true
          },{
            name: 'Times sweared',
            value: usrqry.sweared,
            inline: true
          },{
            name: 'Verified?',
            value: usrqry.verified,
            inline: true
          }]
        }});
      }
    }
  }

  // Points system //

  // Verify command
  if (msg === `${prefix}VERIFY`) {
    if (usrPoint[sender.id].verified === true) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'You already verified',
        color: errClr
      }});
      return;
    }
    usrPoint[sender.id].points += 50;
    message.channel.send({embed:{
      author:{
        name: sender.username,
        icon_url: sender.avatarURL,
      },
      title: 'Operation successful',
      description: `You have been verified and earned \`50\`\nCurrent Balance: \`${usrPoint[sender.id].points}\``,
      color: trueClr
    }});
    usrPoint[sender.id].verified = true;

  }

  // SP command (show points)
  if (msg.startsWith(`${prefix}SP`)) {
    if (msg === `${prefix}SP`) {
      message.channel.send({embed:{
        author:{
          name: sender.username,
          icon_url: sender.avatarURL,
        },
        title: 'Points',
        description: `Current balance: \`${usrPoint[sender.id].points}\`\nCurrent rank: \`${usrPoint[sender.id].rank}\``,
        color: trueClr
      }})
      message.delete();
    } else {
      let mentionedUsr = message.mentions.users.first();
      if (!usrPoint[mentionedUsr.id]) {
        usrPoint[mentionedUsr.id] = {
          "name": mentionedUsr.username,
          "id": mentionedUsr.id,
          "points": 0,
          "verified": false,
          "rank": "Default",
          "messagesSent": 0,
          "sweared": 0
        }
      }
      message.channel.send({embed:{
        author:{
          name: mentionedUsr.username,
          icon_url: mentionedUsr.avatarURL,
        },
        title: 'Points',
        description: `Current balance: \`${usrPoint[mentionedUsr.id].points}\`\nCurrent rank: \`${usrPoint[mentionedUsr.id].rank}\``,
        color: trueClr
      }})
    }

  }

  // Add-p command
  if (msg.startsWith(`${prefix}ADD-P`)) {
    hasAdmin = message.member.hasPermission("ADMINISTRATOR");
    if (!hasAdmin) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'This command is only for admins',
        color: errClr
      }});
      return;
    }
    let mentionedUsr = message.mentions.users.first();
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Please put \`user\` as your first arguement then \`amount\``,
        color: errClr
      }});
      return;
    }
    if (mentionedUsr == undefined) {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[0]}\` is not a valid mentioned user`,
        color: errClr
      }});
      return;
    }
    if (!usrPoint[mentionedUsr.id]) {
      usrPoint[mentionedUsr.id] = {
        "name": mentionedUsr.username,
        "id": mentionedUsr.id,
        "points": 0,
        "verified": false,
        "rank": "Default",
        "messagesSent": 0,
        "sweared": 0
      }
    }
    if (!args[args.length - 1]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify the number of points to be added as your arguement',
        color: errClr
      }});
      return;
    }
    if (isNaN(args[args.length - 1])) {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[args.length - 1]}\` is not a valid number`,
        color: errClr
      }});
      return;
    }
    if (parseFloat(args[args.length - 1]) < 0) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Cannot add a negative number',
        color: errClr
      }});
      return;
    }
    if (!Number.isInteger(parseFloat(args[args.length - 1]))) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Cannot add a decimal number`,
        color: errClr
      }});
      return;
    }
    usrPoint[mentionedUsr.id].points += parseInt(args[args.length - 1]);
    message.channel.send({embed:{
      title: 'Operation successful!',
      description: `Added \`${args[args.length - 1]}\` to ${mentionedUsr.username}\'s account\nCurrent balance: \`${usrPoint[mentionedUsr.id].points}\``,
      color: trueClr
    }});
    message.delete();
  }

  // Remove-p command
  if (msg.startsWith(`${prefix}REMOVE-P`)) {
    hasAdmin = message.member.hasPermission("ADMINISTRATOR");
    if (!hasAdmin) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'This command is only for admins',
        color: errClr
      }});
      return;
    }
    let mentionedUsr = message.mentions.users.first();
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Please put \`user\` as your first arguement then \`amount\``,
        color: errClr
      }});
      return;
    }
    if (mentionedUsr == undefined) {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[0]}\` is not a valid mentioned user`,
        color: errClr
      }});
      return;
    }
    if (!usrPoint[mentionedUsr.id]) {
      usrPoint[mentionedUsr.id] = {
        "name": mentionedUsr.username,
        "id": mentionedUsr.id,
        "points": 0,
        "verified": false,
        "rank": "Default",
        "messagesSent": 0,
        "sweared": 0
      }
    }
    if (!args[args.length - 1]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify the number of points to be removed as your arguement',
        color: errClr
      }});
      return;
    }
    if (isNaN(args[args.length - 1])) {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[args.length - 1]}\` is not a valid number`,
        color: errClr
      }});
      return;
    }
    if (parseFloat(args[args.length - 1]) < 0) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Cannot remove a negative number',
        color: errClr
      }});
      return;
    }
    if (!Number.isInteger(parseFloat(args[args.length - 1]))) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Cannot remove a decimal number`,
        color: errClr
      }});
      return;
    }
    usrPoint[mentionedUsr.id].points -= parseInt(args[args.length - 1]);
    message.channel.send({embed:{
      title: 'Operation successful!',
      description: `Removed \`${args[args.length - 1]}\` from ${mentionedUsr.username}\'s account\nCurrent balance: \`${usrPoint[mentionedUsr.id].points}\``,
      color: trueClr
    }});
    message.delete();
  }

  // Set-p command
  if (msg.startsWith(`${prefix}SET-P`)) {
    hasAdmin = message.member.hasPermission("ADMINISTRATOR");
    if (!hasAdmin) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'This command is only for admins',
        color: errClr
      }});
      return;
    }
    let mentionedUsr = message.mentions.users.first();
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Please put \`user\` as your first arguement then \`amount\``,
        color: errClr
      }});
      return;
    }
    if (mentionedUsr == undefined) {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[0]}\` is not a valid mentioned user`,
        color: errClr
      }});
      return;
    }
    if (!usrPoint[mentionedUsr.id]) {
      usrPoint[mentionedUsr.id] = {
        "name": mentionedUsr.username,
        "id": mentionedUsr.id,
        "points": 0,
        "verified": false,
        "rank": "Default",
        "messagesSent": 0,
        "sweared": 0
      }
    }
    if (!args[args.length - 1]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify the number of points to be set as your arguement',
        color: errClr
      }});
      return;
    }
    if (isNaN(args[args.length - 1])) {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[args.length - 1]}\` is not a valid number`,
        color: errClr
      }});
      return;
    }
    if (parseFloat(args[args.length - 1]) < 0) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Cannot set a negative number',
        color: errClr
      }});
      return;
    }
    if (!Number.isInteger(parseFloat(args[args.length - 1]))) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Cannot set a decimal number`,
        color: errClr
      }});
      return;
    }
    usrPoint[mentionedUsr.id].points = parseInt(args[args.length - 1]);
    message.channel.send({embed:{
      title: 'Operation successful!',
      description: `${mentionedUsr.username}\'s account has been set to \`${args[args.length - 1]}\``,
      color: trueClr
    }});
    message.delete();
  }

  // Reset-p command
  if (msg === `${prefix}RESET-P`) {
    hasAdmin = message.member.hasPermission("ADMINISTRATOR");
    if (!hasAdmin) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'This command is only for admins',
        color: errClr
      }});
      return;
    }
    for (let userID in usrPoint) {
      usrPoint[userID].points = 0;
      usrPoint[userID].verified = false;
      usrPoint[userID].rank = "Default",
      usrPoint[userID].sweared = 0
    }
    message.channel.send({embed:{
      title: 'Operation successful!',
      description: 'Points of all users have been reset.\nVerifications of all users have been reset.\nRanks of all users have been reset.\nTimes sweared of all users have been reset.',
      color: trueClr
    }});
  }

  // Levelup command
  if (msg === `${prefix}LEVELUP`) {
    let currentRank = usrPoint[sender.id].rank;
    let currentPoints = usrPoint[sender.id].points;
    let nextRank;
    let rankFound = false;
    for (let i = 0; i < ranks.length; i++) {
      if (ranks[i].name.toUpperCase() === currentRank.toUpperCase()) {
        if (ranks[i+1]) {
          nextRank = ranks[i+1];
          rankFound = true;
          break;
        }
      }
    }
    if (rankFound === false) {
      message.channel.send({embed:{
        title: 'Error',
        description: `You currently have the highest rank possible in the list`,
        color: errClr
      }});
      return;
    }
    if (currentPoints < nextRank.requiredPoints) {
      message.channel.send({embed:{
        title: 'Error',
        description: `Cannot levelup, you need \`${nextRank.requiredPoints - currentPoints}\` more points to levelup`,
        color: errClr
      }});
      return;
    }
    usrPoint[sender.id].rank = nextRank.name;
    usrPoint[sender.id].points -= nextRank.requiredPoints;
    message.channel.send({embed:{
      title: 'Operation successful!',
      description: `Congrats, you acquired the \`${nextRank.name}\` rank`,
      color: trueClr
    }});
  }

  // Rank command
  if (msg.startsWith(`${prefix}RANK`)) {
    let msgCont = msg.split(" ")
    if (msgCont[0] != `${prefix}RANK`) return;
    if (!args[0]) {
      message.channel.send({embed:{
        title: 'Error',
        description: 'Please specify one of the \`rank\` options as your argument',
        color: errClr
      }});
      return;
    }
    // Add arguement
    if (args[0].toUpperCase() === 'ADD') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'This command is only for admins',
          color: errClr
        }});
        return;
      }
      if (args.length != 4) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Please refer to \`${prefix}help rank\``,
          color: errClr
        }});
        return;
      }
      if (isNaN(args[2])) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[2]}\` is not a valid number of points`,
          color: errClr
        }});
        return;
      }
      if (parseFloat(args[2]) < 0) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[2]}\` is not a valid number of points`,
          color: errClr
        }});
        return;
      }
      if (!Number.isInteger(parseFloat(args[2]))) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[2]}\` is not a valid number of points`,
          color: errClr
        }});
        return;
      }
      if (isNaN(args[3])) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[3]}\` is not a valid order`,
          color: errClr
        }});
        return;
      }
      if (parseFloat(args[3]) < 0) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[3]}\` is not a valid order`,
          color: errClr
        }});
        return;
      }
      if (!Number.isInteger(parseFloat(args[3]))) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[3]}\` is not a valid order`,
          color: errClr
        }});
        return;
      }
      for (let i = 0; i < ranks.length; i++) {
        if (ranks[i].order == parseFloat(args[3])) {
          message.channel.send({embed:{
            title: 'Error',
            description: `Order \`${args[3]}\` is already occupied by \`${ranks[i].name}\`\nPlease choose another order or change the current order of the occupying rank`,
            color: errClr
          }});
          return;
        }
      }
      ranks.push({
        "name": capitalize(args[1]),
        "requiredPoints": parseFloat(args[2]),
        "order": parseFloat(args[3])
      });
      message.channel.send({embed:{
        title: 'Operation successful!',
        description: `Added a new rank:\n**Name**: \`${capitalize(args[1])}\`\n**Required points**: \`${parseFloat(args[2])}\`\n**Order**: \`${parseFloat(args[3])}\``,
        color: trueClr
      }});
    }

    // Remove arguement
    else if (args[0].toUpperCase() === 'REMOVE') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'This command is only for admins',
          color: errClr
        }});
        return;
      }
      let found = false;
      for (let i = 0; i < ranks.length; i++) {
        if (ranks[i].name.toUpperCase() === args[1].toUpperCase()) {
          ranks.splice(i, 1);
          found = true;
        }
      }
      if (found = false) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Cannot find rank \`${args[1]}\``,
          color: errClr
        }});
        return;
      } else if (found = true) {
          message.channel.send({embed:{
            title: 'Operation successful!',
            description: `Removed rank \`${args[1]}\``,
            color: trueClr
          }});
      }
    }

    // Update arguement
    else if (args[0].toUpperCase() === 'UPDATE') {
      hasAdmin = message.member.hasPermission("ADMINISTRATOR");
      if (!hasAdmin) {
        message.channel.send({embed:{
          title: 'Error',
          description: 'This command is only for admins',
          color: errClr
        }});
        return;
      }
      if (args.length !== 5) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Invalid syntax, refer to \`${prefix}rank help\``,
          color: errClr
        }});
        return;
      }
      let rankFound = false;
      let oldRank = {};
      let newRank = {};
      for (let i = 0; i < ranks.length; i++) {
        if (args[1].toUpperCase() == ranks[i].name.toUpperCase()) {
          rankFound = true;
          oldRank = ranks[i];
          break;
        }
      }
      if (rankFound = false) {
        message.channel.send({embed:{
          title: 'Error',
          description: `Cannot find rank \`${args[1]}\``,
          color: errClr
        }});
        return;
      }
      if (isNaN(args[3])) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[3]}\` is not a valid number of points`,
          color: errClr
        }});
        return;
      }
      if (!Number.isInteger(parseFloat(args[3]))) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[3]}\` is not a valid number of points`,
          color: errClr
        }});
        return;
      }
      if (parseFloat(args[3]) < 0) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[3]}\` is not a valid number of points`,
          color: errClr
        }});
        return;
      }
      if (isNaN(args[4])) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[4]}\` is not a valid order`,
          color: errClr
        }});
        return;
      }
      if (!Number.isInteger(parseFloat(args[4]))) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[4]}\` is not a valid order`,
          color: errClr
        }});
        return;
      }
      if (parseFloat(args[4]) < 0) {
        message.channel.send({embed:{
          title: 'Error',
          description: `\`${args[4]}\` is not a valid order`,
          color: errClr
        }});
        return;
      }
      newRank = {
        "name": capitalize(args[2]),
        "requiredPoints": parseFloat(args[3]),
        "order": parseFloat(args[4])
      }
      ranks[ranks.indexOf(oldRank)] = newRank;
      message.channel.send({embed:{
        title: 'Operation successful!',
        description: `Changed \`${oldRank.name}\` rank`,
        fields: [{
          name: 'Old rank',
          value: `**Name**: \`${oldRank.name}\`\n**Requred points**: \`${oldRank.requiredPoints}\`\n**Order**: \`${oldRank.order}\``
        },{
          name: 'Updated rank',
          value: `**Name**: \`${newRank.name}\`\n**Requred points**: \`${newRank.requiredPoints}\`\n**Order**: \`${newRank.order}\``
        }],
        color: trueClr
      }});
    }

    // List arguement
    else if (args[0].toUpperCase() === 'LIST') {
      const embed = new Discord.RichEmbed()
        .setColor(trueClr);
      embed.setTitle('Ranks List');
      let ranksFound = 0;
      for (let i = 0; i < ranks.length; i++) {
        embed.addField(ranks[i].name, `**Required Points**: \`${ranks[i].requiredPoints}\`\n**Order**: \`${ranks[i].order}\``, true)
        ranksFound++;
      }
      embed.setDescription(`Found ${ranksFound} ranks`);
      embed.setFooter('Currently showing ranks list');
      message.channel.send({embed});
    }

    // Help arguement
    else if (args[0].toUpperCase() === 'HELP') {
      message.channel.send({embed:{
        title: 'Rank Help',
        color: trueClr,
        fields: [{
          name: 'Add',
          value: `**Description**: Adds a new rank to the ranks list\n**Note**: When a new rank is added, please use \`${prefix}reset-p\` to reset the points and the ranks for all users\n**Usage**: \`${prefix}rank add <Name> <required points> <order>\``
        },{
          name: 'Remove',
          value: `**Description**: Removes a rank from the ranks list\n**Note**: When a rank is removed, please use \`${prefix}reset-p\` to reset the points and the ranks for all users\n**Usage**: \`${prefix}rank remove <Name>\``
        },{
          name: 'Update',
          value: `**Description**: Updates a rank in the ranks list\n**Note**: When a rank is removed, please use \`${prefix}reset-p\` to reset the points and the ranks for all users\n**Usage**: \`${prefix}rank update <old name> <new name> <new required points> <new order>\``
        },{
          name: 'List',
          value: `**Description**: Displays the ranks list\n**Usage**: \`${prefix}rank list\``
        }]
      }});
    }

    else {
      message.channel.send({embed:{
        title: 'Error',
        description: `\`${args[0]}\` is not recognized as an option for \`rank\``,
        color: errClr
      }});
    }

    // Sorting the order
    ranks.sort(function(a, b) {
      return a.order - b.order;
    })
  }



  // To save the files
  fs.writeFile('Storage/botData.json', JSON.stringify(botData), (err) => {
    if (err) console.error(err); // To log if there is an error
  });
  fs.writeFile('Storage/wrnUsr.json', JSON.stringify(wrnUsr), (err) => {
    if (err) console.error(err);
  });
  fs.writeFile('Storage/usrPoint.json', JSON.stringify(usrPoint), (err) => {
    if (err) console.error(err);
  });
  fs.writeFile('Storage/ranks.json', JSON.stringify(ranks), (err) => {
    if (err) console.error(err);
  });
  fs.writeFile('Storage/bannedWords.json', JSON.stringify(bannedWords), (err) => {
    if (err) console.error(err);
  });
  fs.writeFile('Storage/reportLog.json', JSON.stringify(reportLog), (err) => {
    if (err) console.error(err);
  });


});


// Logging when the bot starts
bot.on('ready', () => {
  console.log('Jr. GPS launched...');

  bot.user.setStatus('online'); // Status can be 'Online', 'idle', 'invisible', & 'dnd'
  bot.user.setActivity(`${prefix}help`);
});

// Login
bot.login(token);
