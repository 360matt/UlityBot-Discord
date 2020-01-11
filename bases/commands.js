module.exports = class {

    constructor (_msg, _client){
        this.client = _client;
        this.msg = _msg;
    }

    exec (){

        var colors = require('colors');
        colors.setTheme({})

        if (this.client == null || this.msg == null){
            let errHandle = require(`../error`)
            errHandle("commands.js (ligne 13):".yellow + " Class non initialisée correctement".red)
            return;
        }

        const fs = require(`fs`)

        try {
            if (!fs.existsSync(`${__dirname}/../commands/${this.msg.command}.js`)) {
                return;
            }
        } catch(err) {
            let errHandle = require(`../error`)
            errHandle(err)
            return;
        }

        try {
            require.resolve(`${__dirname}/../commands/${this.msg.command}.js`);
        } catch(e) {
            if (e.code == "MODULE_NOT_FOUND")
                return;
            else{
                let errHandle = require(`../error`)
                errHandle(e)
                return;
            }
        }

        let Handle = require(`../commands/${this.msg.command}.js`)

        if (Handle.run == null){
            let errHandle = require(`../error`)
            errHandle(`commande ` + `${this.msg.command}`.yellow + `:` + ` méthode `.red + `run()` + ` non initialisée`.red)
            return;
        }

        if (Handle.data == null){
            let errHandle = require(`../error`)
            errHandle(`commande ` + `${this.msg.command}`.yellow + `:` + ` propriétés `.red + `data {...}` + ` non initialisée`.red)
            return;
        }

         
        if (!this.client.hasPermission.withMember(this.msg.author.id).withGuild(this.msg.guild.id).withPermission(Handle.data.permission).exec()){

            this.msg.channel.send(`<@${this.msg.author.id}>, Sah alors, tu n'as pas les permissions nécessaires`)
            .then((m) => {
                this.msg.removeAfter(m)
            })


            return;
        }


        
      //  if (!JSON.stringify(this.client.config.staff).includes(this.msg.author.id)){
            if (!this.msg.cooldown.isThere()){
                this.msg.channel.send(`<@${this.msg.author.id}>, tu devrais souffler un peu dans ce sac, tu doit patienter \`\`${this.client.time.after().withSeconds(this.msg.cooldown.getLeft()).exec()}\`\` avant de pouvoir ré-éxecuter cette commande`)
                .then((m) => {
                    this.msg.removeAfter(m)
                })
                return;
            }
       // }
        
        

        Handle.run(this.msg, this.client, this.msg.args);

        
        this.msg.cooldown.global().make()
        

    }


}