const DiscordManager = require('./DiscordManager')
const Logger = require('./Logger')

class Application {
  async register() {
    this.discord = new DiscordManager(this)
    this.log = new Logger()
  }
  async connect() {
    this.discord.connect()
  }
}

module.exports = new Application()