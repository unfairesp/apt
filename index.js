require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands= new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`Loaded command: ${command.data.name}`);
}); 

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);                    // if you dont understand the code, then dont change it. :D
});                                                                    // if you want to learn just search discord.js documentation

client.on('messageCreate', async message => {
    if (!message.content.startsWith('.') || message.author.bot) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        message.reply('There was an error trying to execute that command!');
    }
}); 

client.login(process.env.token)
    .then(() => console.log('Bot is online!'))
