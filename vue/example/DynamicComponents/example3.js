var page1 = Vue.component('page1', () => import('./page1.js'))
var page2 = Vue.component('page2', () => import('./page2.js'))
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
