const isFunction = o => typeof o === 'function'
const isPromise = o => o && typeof o === 'object' && o.then && isFunction(o.then)
const loop = o => o
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class _Promise {
  private status: string

  private value: any

  private fulfilledQueue: Function[]

  private rejectedQueue: Function[]

  constructor(resolver: Function) {
    if (!isFunction(resolver)) {
      throw new Error('_Promise must accept a function as a parameter')
    }
    this.status = PENDING
    this.fulfilledQueue = []
    this.rejectedQueue = []
    try {
      resolver(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  private resolve = (value: any) => {
    const run = () => {
      if (this.status !== PENDING) return
      this.status = FULFILLED
      this.value = value
      if (isPromise(this.value)) {
        this.value.then(
          v => this.fulfilledQueue.forEach(fulfilled => fulfilled(v)),
          e => this.rejectedQueue.forEach(rejected => rejected(e))
        )
      } else {
        this.fulfilledQueue.forEach(fulfilled => fulfilled(this.value))
      }
    }
    setTimeout(run, 0)
  }

  private reject = (error: any) => {
    const run = () => {
      if (this.status !== PENDING) return
      this.value = error
      this.status = REJECTED
      this.rejectedQueue.forEach(rejected => rejected(this.value))
    }
    setTimeout(run, 0)
  }

  then = (onFulfilled?: Function, onRejected?: Function) => {
    if (!isFunction(onFulfilled)) {
      onFulfilled = loop
    }
    if (!isFunction(onRejected)) {
      onRejected = loop
    }
    return new _Promise((resolve, reject) => {
      function onFulfilledNext(value) {
        try {
          const res = onFulfilled(value)
          if (isPromise(res)) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        } catch (err) {
          reject(err)
        }
      }

      function onRejectedNext(error) {
        try {
          const res = onFulfilled(error)
          if (isPromise(res)) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        } catch (err) {
          reject(err)
        }
      }
      if (this.status === PENDING) {
        this.fulfilledQueue.push(onFulfilledNext)
        this.rejectedQueue.push(onRejectedNext)
      } else if (this.status === FULFILLED) {
        onFulfilledNext(this.value)
      } else {
        onRejectedNext(this.value)
      }
    })
  }

  catch = (onRejected?: Function) => {
    this.then(undefined, onRejected)
  }

  finally = (onFinally?: Function) => {
    if (isFunction(onFinally)) {
      onFinally()
    }
    return this.then()
  }

  static resolve(value: any) {
    if (isPromise(value)) return value
    return new _Promise(resolve => resolve(value))
  }

  static reject(error: any) {
    return new _Promise((resolve, reject) => reject(error))
  }

  static all(list: Array<any>) {
    const len = list.length
    return new _Promise((resolve, reject) => {
      let values = []
      let count = 0
      list.forEach((p, i) => {
        if (isPromise(p)) {
          p.then(
            value => {
              count += 1
              values[i] = value
              if (count === len) resolve(values)
            },
            error => {
              count += 1
              values[i] = error
              reject(error)
            }
          )
        } else {
          count += 1
          values[i] = p
          if (count === len) resolve(values)
        }
      })
    })
  }

  static race(list: Array<any>) {
    return new _Promise((resolve, reject) => {
      list.forEach((p, i) => {
        if (isPromise(p)) {
          p.then(
            value => resolve(value),
            error => reject(error)
          )
        } else {
          resolve(p)
        }
      })
    })
  }
}
