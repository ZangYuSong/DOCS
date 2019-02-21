var children = Vue.component('children', {
  template: '<span>{{ message }}</span>',
  props: ['message'],
  beforeCreate: function() {
    console.log('beforeCreate children')
  },
  created: function() {
    console.log('created children')
  },
  beforeMount: function() {
    console.log('beforeMount children')
  },
  mounted: function() {
    console.log('mounted children')
  },
  beforeUpdate: function() {
    console.log('beforeUpdate children')
  },
  updated: function() {
    console.log('updated children')
  },
  beforeDestroy: function() {
    console.log('beforeDestroy children')
  },
  destroyed: function() {
    console.log('destroyed children')
  }
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'children'
  },
  components: { children },
  beforeCreate: function() {
    console.log('beforeCreate')
  },
  created: function() {
    console.log('created')
  },
  beforeMount: function() {
    console.log('beforeMount')
  },
  mounted: function() {
    console.log('mounted')
  },
  beforeUpdate: function() {
    console.log('beforeUpdate')
  },
  updated: function() {
    console.log('updated')
  },
  beforeDestroy: function() {
    console.log('beforeDestroy')
  },
  destroyed: function() {
    console.log('destroyed')
  }
})
setTimeout(function() {
  app.message = 2
}, 1000)
setTimeout(function() {
  app.$destroy()
  app.message = 3
}, 2000)
