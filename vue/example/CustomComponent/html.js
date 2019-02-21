var createElement = function() {}

createElement('div', '123') // <div>123</div>
createElement(
  'div',
  {
    domProps: {
      title: '123'
    }
  },
  '123'
) // <div title="123">123</div>
createElement(
  'div',
  {
    domProps: {
      title: '123'
    }
  },
  ['123', createElement('span', ['span']), '321']
) // <div title="123">123<span>span</span>321</div>
