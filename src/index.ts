const targetMap = new WeakMap();
const product = { price: 200, quantity: 2 };

let total: number = 0;

type Effect = () => void;

const totalEffect = () => {
  total = product.price * product.quantity;
};

const track = (target: Object, key: string | symbol, effect: Effect) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set<Effect>()));
  }
  dep.add(effect);
};

const trigger = (target: Object, key: string | symbol) => {
  // targetMapからdepsMapを取得
  const dep = targetMap.get(target)?.get(key);
  if (!dep) {
    return;
  }
  dep.forEach((e: Effect) => e());
};

const reactive = <T>(target: T): ProxyConstructor => {
  return new Proxy(target, {
    get(target, key, receiveer) {
      const result = Reflect.get(target, key, receiveer);
      track(target, key, totalEffect);
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const result = Reflect.set(target, key, value, receiver);
      if (result && oldValue !== value) {
        trigger(target, key);
      }
      return result;
    }
  });
};

const productProxy = reactive(product);
console.log("変更前:", total); // => 600

productProxy.quantity = 4;

productProxy.price = 400;
// quantityを変更

// 当たり前だが変更されない
console.log("変更後:", total); // => 600
