export default {
  template: `
  <ul>
    <li v-for="(item, index) in list"><slot :item="item">我是默认：{{ item.name }}</slot></li> 
  </ul>
  `,
  props: ['list']
}
