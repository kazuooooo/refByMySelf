import { effect } from "./internal"
import { ref } from "./ref"

export const computed = (getter: () => any) => {
  let result = ref()
  effect(() => (result.value = getter()))
  return result
}
