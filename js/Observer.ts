interface Observer {
  update(): void
}

interface Subject {
  subscribe(observer: Observer): void

  unsubscribe(observer: Observer): void

  notify(): void
}

class CurrentSubject implements Subject {
  private observerList: Observer[]

  subscribe(observer: Observer) {
    this.observerList.push(observer)
  }

  unsubscribe(observer: Observer) {
    this.observerList.splice(this.observerList.indexOf(observer), 1)
  }

  notify() {
    this.observerList.forEach(observer => {
      observer.update()
    })
  }
}

class CurrentObserver implements Observer {
  update() {}
}
