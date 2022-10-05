import { computed, reactive } from "./reactive/index"
const product = reactive({ price: 5, quantity: 2 })
let salePrice = computed(() => product.price * 0.9)
let total = computed(() => salePrice.value * product.quantity)

// salePriceには変更されるが、salePriceに依存するtotalの値は変更されない
product.price = 10
console.log(
  `total (should be 18) = ${total} salePrice (should be 9) = ${salePrice.value}`
  // total (should be 18) = 0 salePrice (should be 9) = 9
)

export {}
