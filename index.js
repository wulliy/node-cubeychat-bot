// cubey should really protect his sockets better kmao
// too many variables :dead: :skull: :troll:

const WebSocket = require("ws")
const flatfile = require("flat-file-db")
const fetch = require("node-fetch")

const ws = new WebSocket("wss://chat.cubeythecube.repl.co")
const db = flatfile.sync("cubey.db")

const prefix = "/"
const name = "sussy bot"

const cooldown = new Set()
const cooldownTime = 500

const cmdCooldown = new Set()
const cmdCooldownTime = 1000

const random = (min, max) => {return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)}
const isNum = (x) => {return !isNaN(Number(x))}

function sendMessage(msg) {
    const data = {
        user: name,
        content: msg,
    }

    ws.send(JSON.stringify(data))
}


function specialMessage(user, msg) {
    const data = {
        user: user,
        content: msg,
    }

    ws.send(JSON.stringify(data))
}

function systemMessage(msg) {
    const data = {
        type: "system",
        user: "joe",
        joined: true,
        content: msg
      }
  
      ws.send(JSON.stringify(data))
}


ws.on("open", () => {
	const data = {
		type: "system",
		user: name,
		joined: true,
		content: `${name} joined the chat`
	}
	
	ws.send(JSON.stringify(data))
})

ws.on("message", (data) => {
	const msg = JSON.parse(data)
	
	if (msg.type) return
	
	if (!cooldown.has(msg.user)) {
        if (msg.user == name) return

        cooldown.add(msg.user)
    } else if (cooldown.has(msg.user) && !cmdCooldown.has(msg.user)) {
        if (msg.user == name) return

        systemMessage(`stop spamming ${msg.user}, you should really take your normal pills.`)
    }
	
	const args = msg.content.toLowerCase().slice(prefix.length).split(/ +/)
    const cmd = args.shift()

    if (cmd == "ping") {
        sendMessage("you sir just did a sussy ping! :flushed:")
    }
	
	 if (cmd == "balance" || cmd == "bal") {
        if (!db.has(msg.user)) db.put(msg.user, 0)

        let balance = db.get(msg.user)

        sendMessage(`@${msg.user}, you have ${balance} suscoins.`)
    }
	
	if (cmd == "say") {
        if (!args.length > 0) return sendMessage("imagine")

        sendMessage(args.join(" "))
    }

    if (cmd == "norrisjoke") {
        sendMessage("fetching norris joke...")

        fetch("https://api.chucknorris.io/jokes/random").then(e=>e.json()).then(e=>sendMessage(e.value))
    }
	
	if (cmd == "kill") {
        systemMessage("you arent op to do that stfu lmao")
    }

    if (cmd == "op") {
        systemMessage("no fuck you")
    }

    if (cmd == "fuck") {
        if (!args[0]) return

        systemMessage("go to horny jail")
    }
	
	if (cmd == "beg") {
        if (!cmdCooldown.has(msg.user)) {
            cmdCooldown.add(msg.user)
        } else {
            setTimeout(() => {cmdCooldown.delete(msg.user)}, cmdCooldownTime)
            return sendMessage(`@${msg.user}, please wait at least 1 seconds before running this command again.`)
        }

        if (!db.has(msg.user)) return sendMessage("you dont have a wallet yet go get one by saying \"/balance\" or \"/bal\"")
        if (!isNum(db.get(msg.user))) return sendMessage("your wallet is fucked up, go ask willy to reset your wallet")
        
        let balance = Number(db.get(msg.user))
        let amount = random(0, 100)

        if (amount == 0 || amount < 1) return sendMessage(`@${msg.user}, wow you are so unlucky you got fucking 0 suscoins lmao`)
        if (amount > 1) {
            db.put(msg.user, balance + amount)
            sendMessage(`@${msg.user}, you got ${amount} suscoins. you now have ${balance + amount} suscoins.`)
        }
    }
	
	setTimeout(() => {cooldown.delete(msg.user)}, cooldownTime)
})

console.log("cubey bot running :flushed:")