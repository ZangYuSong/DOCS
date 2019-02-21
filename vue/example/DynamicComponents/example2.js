var page1 = Vue.component('page1', resolve => {
  setTimeout(function() {
    resolve({
      template: '<span>page1</span>',
      created() {
        console.log(new Date().getTime())
      }
    })
  }, 3000)
})
var page2 = Vue.component('page2', resolve => {
  setTimeout(function() {
    resolve({
      template: '<span>page2</span>',
      created() {
        console.log(new Date().getTime())
      }
    })
  }, 3000)
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
