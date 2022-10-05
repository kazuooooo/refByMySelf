const targetMap = new WeakMap()

type Effect = () => void
let activeEffect: Effect | null = null

export const effect = (e: Effect) => {
  activeEffect = e
  e()
  activeEffect = null
}

export const track = (target: Object, key: string | symbol) => {
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

export const trigger = (target: Object, key: string | symbol) => {
  const dep = targetMap.get(target)?.get(key)
  if (!dep) {
    return
  }
  console.log("trigger", target, key)
  dep.forEach((e: Effect) => e())
}
