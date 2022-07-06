const StateHandler = require('./handlers/StateHandler')
const CommandHandler = require('./handlers/CommandHandler')
const { Client, Collection, Intents } = require('discord.js');
const config = require("../config.json");
const fs = require('fs')
const path = require('node:path');

class DiscordManager {
  constructor(app) {
    this.app = app
    this.stateHandler = new StateHandler(this)
    this.commandHandler = new CommandHandler(this)
  }

  connect() {
    // Discord Client
    const client = new Client({intents: new Intents(32767)})
    this.client = client
    this.client.on('ready', () => this.stateHandler.onReady())
    this.client.login(config.discord.token).catch(error => {this.app.log.error(error)})

    // Getting Commands
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.data.name, command);
    }

    // Event Manager
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {client.once(event.name, (...args) => event.execute(...args));} 
      else {client.on(event.name, (...args) => event.execute(...args));} 
    }
    
  }
}
module.exports = DiscordManager