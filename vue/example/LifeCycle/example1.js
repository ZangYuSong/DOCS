var app = new Vue({
  el: '#app',
  data: { message: 1 },
  beforeCreate: function() {
    console.log('beforeCreate')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  },
  created: function() {
    console.log('created')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  },
  beforeMount: function() {
    console.log('beforeMount')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  },
  mounted: function() {
    console.log('mounted')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  },
  beforeUpdate: function() {
    console.log('beforeUpdate')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  },
  updated: function() {
    console.log('updated')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  },
  beforeDestroy: function() {
    console.log('beforeDestroy')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  },
  destroyed: function() {
    console.log('destroyed')
    console.log('DOM = ' + (this.$el && this.$el.innerText))
    console.log('$data.message = ' + (this.$data && this.$data.message))
    console.log('-----------------------------------------------')
  }
})
setTimeout(function() {
  app.message = 2
}, 1000)
setTimeout(function() {
  app.$destroy()
  app.message = 3
}, 2000)
