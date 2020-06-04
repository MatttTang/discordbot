const { MessageEmbed, Client } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client();
const random = require('./src/game.js');

const token = 'NzE2OTA5MDMwOTkxMzMxMzI5.XtSntA.0r3sC1N4p_Ga_9XTfK_CQZ6hYDc';

const PREFIX = '!';

client.on('ready', () =>{
    console.log("Bot is online");
});

console.log(random);

client.on('message', msg =>{
    // If the prefix is used
    if (msg.content.startsWith(PREFIX)){
        // Check if the msg length is valid
        if (msg.content.length > 1){
            let args = msg.content.slice(1).split(" ");
            if (args.length > 1){
                msg.reply("Too many arguments");
                return;
            }
            // Grab that argument and make a request to dictionary
            let word = args[0];
            let url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=3de6d44b-f9f6-46b7-a9dd-4edf259fa42d`;
            // Get request to the dictionary api
            fetch(url).then(function (u){
                return u.json().then(function (response){
                    // If the response has a definition, the word was a word, handle it
                    if (response[0].hasOwnProperty('shortdef')){
                        msg.reply(new MessageEmbed()
                            .setTitle(word[0].toUpperCase() + word.slice(1))
                            .setDescription(`${response[0].fl}: ${response[0].shortdef[0]}`)
                            .setColor('RANDOM')
                        );
                    }
                    // If the word did not have a dictionary, it was not a word, present suggestions
                    else{
                        // Create an embed Messsage, and add properties
                        let modWord = word.toLocaleLowerCase();
                        modWord = modWord[0].toUpperCase() + modWord.slice(1);
                        let fResponse = new MessageEmbed();
                        fResponse.setTitle(`${modWord}`);
                        fResponse.setColor('RANDOM');
                        fResponse.setThumbnail('https://www.mobafire.com/images/champion/skins/landscape/ahri-kda.jpg');
                        fResponse.setDescription(`${modWord} is not a word. Did you mean one of these?`);
                        // For each word suggestion, present it in the embed message
                        response.forEach(element => {
                            fResponse.addField(`${element}`, '-', true);
                        });
                        // Send the message as a reply
                        msg.reply({embed: fResponse});
                    }
                }).catch(function (err){
                    console.log(err);
                })
            }).catch(err => alert(err));
        }
        else{
            msg.reply(new MessageEmbed()
                .setTitle('Invalid Command')
                .setDescription('The command you entered is empty')
            );
        }
    }

    
});

client.login(token);