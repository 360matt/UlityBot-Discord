module.exports = class {

    constructor(_client){
        this.client = _client
    }

    withMember (_member){ this.member = _member; return this; }
    withGuild (_guild){ this.guild = _guild; return this; }
    withPermission (_permission){ this.permission = _permission; return this; }

    exec(){
        if (this.client == null || this.member == null || this.guild == null){
            console.error(` class mal initialisée`.red)
            return;
        }

        if (this.permission == "" || this.permission == null)
            return true
        if (this.permission)
            return true

        try{
            return this.client.guilds.get(this.guild).members.resolve(this.member).hasPermission(this.permission)
        }
        catch(e){
            if (e.code != "BITFIELD_INVALID")
                console.error(e)
        }

        return false;

    }
}