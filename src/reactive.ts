const targetMap = new WeakMap()

type Effect = () => void
let activeEffect: Effect | null = null

export const effect = (e: Effect) => {
  activeEffect = e
  e()
  activeEffect = null
}

const track = (target: Object, key: string | symbol) => {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set<Effect>()))
    }
    console.log("tracked", target, key, activeEffect)
    dep.add(activeEffect)
  }
}

const trigger = (target: Object, key: string | symbol) => {
  const dep = targetMap.get(target)?.get(key)
  if (!dep) {
    return
  }
  console.log("trigger", target, key)
  dep.forEach((e: Effect) => e())
}

export const reactive = <T extends object>(target: T) => {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      const result = Reflect.set(target, key, value, receiver)
      if (result && oldValue !== value) {
        trigger(target, key)
      }
      return result
    },
  })
}

type RefValue = string | number
export type Ref<T extends RefValue> = { value: T }
export const ref = <T extends RefValue>(raw?: T) => {
  const r = {
    get value() {
      track(r, "value")
      return raw
    },
    set value(newVal) {
      if (raw !== newVal) {
        raw = newVal
        trigger(r, "value")
      }
    },
  }
  return r
}

export const computed = (getter: () => RefValue) => {
  let result = ref()
  effect(() => (result.value = getter()))
  return result as Ref<RefValue>
}
export {}
