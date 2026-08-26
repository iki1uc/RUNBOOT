masterboot = {

  load: async function(file) {
    return await OS.net.read(file)
  },

  apply: function(geo) {
    OS.zone = geo.zone
    OS.pos  = geo.pos
    OS.dir  = geo.dir
    OS.val  = geo.val
    OS.mov  = geo.mov
    OS.memory = geo.memory
  },

  start: async function() {

    if (!OS.net.online()) {
      throw "NET required: System cannot start offline."
    }

    let geo = await this.load("BOOT.geo")
    this.apply(geo)
  }
}
