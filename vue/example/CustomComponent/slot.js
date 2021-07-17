export default {
  template: `
  <div>
    <div>children</div>
    <slot></slot>
    <div>children</div>
  </div>
  `
}

// export default {
//   template: `
//   <div>
//     <div>这里是 ：<slot name="header"></slot></div>
//     <br>
//     <br>
//     这里是：<slot></slot>
//     <br>
//     <br>
//     <div>这里是：<slot name="footer"></slot></div>
//   </div>
//   `
// };

// export default {
//   template: `
//   <div>
//     <div>这里是 ：<slot name="header">我是默认值header</slot></div>
//     <br>
//     <br>
//     这里是：<slot></slot>
//     <br>
//     <br>
//     <div>这里是：<slot name="footer">我是默认值footer</slot></div>
//   </div>
//   `
// };
