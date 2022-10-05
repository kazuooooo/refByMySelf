import { track, trigger } from "./internal"

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
