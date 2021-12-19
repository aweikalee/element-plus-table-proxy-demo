export interface IDataItem {
  id: number
  order: string
  price: number
  amount: number
  title: string
}

let id = 0
export function list() {
  return new Promise<IDataItem[]>((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from(new Array(20), () => ({
          id: ++id,
          order: `O${Math.random().toFixed(20).slice(2, 22)}`,
          price: Number((Math.random() * 500).toFixed(2)),
          amount: Math.floor(Math.random() * 100),
          title: Number(Math.random().toFixed(10).slice(2, 10))
            .toString(32)
            .toUpperCase(),
        }))
      )
    }, 500)
  })
}
