var page1 = Vue.component('page1', {
  template: '<span>page1</span>',
  created() {
    console.log(new Date().getTime())
  }
})
var page2 = Vue.component('page2', {
  template: '<span>page2</span>',
  created() {
    console.log(new Date().getTime())
  }
})
new Vue({
  el: '#app',
  components: {
    page1,
    page2
  },
  data: {
    current: 'page1',
    tabs: ['page1', 'page2']
  }
})
