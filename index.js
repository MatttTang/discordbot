const { MessageEmbed, Client } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client();
const random = require('./src/game.js');
const connection = require('./src/link.js');
var Person = require('./src/person.js');

const token = 'NzE2OTA5MDMwOTkxMzMxMzI5.XtSntA.0r3sC1N4p_Ga_9XTfK_CQZ6hYDc';

const PREFIX = '!';

// Array for active players in session, key is user name value is ready status
var players = [];

client.on('ready', () =>{
    console.log("Bot is online");
});

console.log(random);

client.on('message', msg =>{
    // If the message does not have the prefix, ignore it
    if (!msg.content.startsWith(PREFIX)){
        return;
    }
    
    // Track how many arguments are in the message
    let args = msg.content.slice(1).split(" ");
    
    // Look at the first argument, that is the command
    switch (args[0]) {

        // If the first argument was command "define"
        case 'define':
            // Make sure arguments are correct
            if (args.length != 2){
                msg.reply('Command failed - Not correct aomunt of arguments');
                return;
            }

            // Grab the word and make a request
            let word = args[1];
            let url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=3de6d44b-f9f6-46b7-a9dd-4edf259fa42d`;
            fetch(url).then(function (u){
                return u.json().then(function (response){
                    let modWord = word.toLowerCase();
                    modWord = modWord[0].toUpperCase() + modWord.slice(1);
                    // If the response has a definition, the word was a word
                    if (response[0].hasOwnProperty('shortdef')){
                        msg.reply(new MessageEmbed()
                            .setTitle(modWord)
                            .setDescription(`${response[0].fl}: ${response[0].shortdef[0]}`)
                            .setColor('RANDOM')
                        );
                    }
                    // If the word does not have a definition, offer suggestions
                    else{
                        // Create an embedded message, add properties
                        let fResponse = new MessageEmbed();
                        fResponse.setTitle(`${modWord}`);
                        fResponse.setColor('RANDOM');
                        fResponse.setThumbnail('https://www.mobafire.com/images/champion/skins/landscape/ahri-kda.jpg');
                        fResponse.setDescription(`${modWord} is not a word. Did you mean one of these?`);
                        // For each word suggestion, present it in the message
                        response.forEach(element => {
                            fResponse.addField(`${element}`, '-', true);
                        });
                        // Send the message
                        msg.reply(fResponse);
                    }
                }).catch(function (err){
                    console.log(err);
                })
            }).catch(err => alert(err));
            break;
        // If the user wants to add themselves to a game, gadd
        case 'gadd':
            // Check if the user is not in the game
            /*connection.query(`SELECT * FROM gamers WHERE user = '${msg.author.username}'`, (err, result) => {
                if (err){
                    msg.reply("Sorry, there was an error with the request");
                    throw err;
                }
                // If the user does not exist yet, add them
                if (result == ""){
                    connection.query(`INSERT INTO gamers (user) VALUES ('${msg.author.username}')`, (poop) =>{
                        if (poop){
                            msg.reply("There was an error inserting you into the game");
                            throw err;
                        }
                        msg.reply("You were added to the game");
                    });
                }
                // If they do exist, do not explode me
                else{
                    msg.reply("You were in the game already");
                }
            });*/
            // Check if user is not in the game yet
            /*if (players.indexOf(msg.author.username) != -1){
                msg.reply("You already exist in the active game");
            }
            // If the user does not exist, add them with ready status false
            else {
                players.push(msg.author.username, false);
                msg.reply("You were added to the active game");
            }*/
            players.push(new Person(msg.author.username));
            break;
        
        case 'gready':
            players[msg.author.username] = !players[msg.author.username];
            if (players[msg.author.username]){
                msg.reply('You have readied');
            }
            else{
                msg.reply('You have unreadied');
            }
            break;

        case 'gstart':
            console.log(players);
            break;
        
        default:
            msg.reply(`"${msg.content}" is not a valid command`);
            break;
    }
});

client.login(token);