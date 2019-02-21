interface Component {}
interface AsyncComponent {}
interface VNode {}
interface VNodeChildrenArrayContents extends Array<VNode | string | VNodeChildrenArrayContents> {}
type ScopedSlot = (props: any) => VNodeChildrenArrayContents | string
interface VNodeDirective {
  readonly name: string
  readonly value: any
  readonly oldValue: any
  readonly expression: any
  readonly arg: string
  readonly modifiers: { [key: string]: boolean }
}

type Tag = string | Component | AsyncComponent | (() => Component)
interface VNodeData {
  key?: string | number
  slot?: string
  scopedSlots?: { [key: string]: ScopedSlot }
  ref?: string
  tag?: string
  staticClass?: string
  class?: any
  staticStyle?: { [key: string]: any }
  style?: object[] | object
  props?: { [key: string]: any }
  attrs?: { [key: string]: any }
  domProps?: { [key: string]: any }
  hook?: { [key: string]: Function }
  on?: { [key: string]: Function | Function[] }
  nativeOn?: { [key: string]: Function | Function[] }
  transition?: object
  show?: boolean
  inlineTemplate?: {
    render: Function
    staticRenderFns: Function[]
  }
  directives?: VNodeDirective[]
  keepAlive?: boolean
}
type VNodeChildren = VNodeChildrenArrayContents | [ScopedSlot] | string

interface CreateElement {
  (tag?: Tag, children?: VNodeChildren): VNode
  (tag?: Tag, data?: VNodeData, children?: VNodeChildren): VNode
}
