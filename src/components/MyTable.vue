<template>
  <el-table ref="table">
    <children />
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MyTable',
})
</script>

<script lang="ts" setup>
import {
  cloneVNode,
  Component,
  computed,
  reactive,
  ref,
  VNode,
  readonly,
  useSlots,
  defineExpose,
} from 'vue'
import * as storage from './storage'

import { useKeepScroll } from './useKeepScroll'

export interface IMyTableColumnProps {
  prop?: string
  label?: string
  fixed?: 'left' | 'right' | boolean
  visiable?: boolean
}

function isElTableColumn(vnode: VNode) {
  return (vnode.type as Component)?.name === 'ElTableColumn'
}

const table = ref()

const slotsOrigin = useSlots()
const slots = computed(() => {
  /* 对 slot 进行分类 */
  const main: VNode[] = [] // ElTableColumn 且存在 prop 属性
  const left: VNode[] = [] // ElTableColumn 不存在 prop 属性，但 fixed="left"
  const other: VNode[] = [] // 其他

  slotsOrigin.default?.()?.forEach((vnode) => {
    if (isElTableColumn(vnode)) {
      const { prop, fixed } = vnode.props ?? {}
      if (prop !== undefined) return main.push(vnode)
      if (fixed === 'left') return left.push(vnode)
    }
    other.push(vnode)
  })

  return {
    main,
    left,
    other,
  }
})

const columnsFormStorage = ref<IMyTableColumnProps[]>(
  storage.get('columns') ?? []
)

/* 列的排序与部分属性 */
const columns = reactive({
  // 本地储存的
  storage: computed<IMyTableColumnProps[]>({
    get() {
      return columnsFormStorage.value
    },
    set(value) {
      columnsFormStorage.value = value
      storage.set('columns', value)
    },
  }),

  // slot 中获取的
  slot: computed(() =>
    slots.value.main.map(({ props }) => ({
      prop: props!.prop,
      label: props!.label,
      fixed: props!.fixed,
      visiable: props!.visiable ?? true,
    }))
  ),

  // 渲染使用的
  render: computed(() => {
    const slot = [...columns.slot]
    const storage = [...columns.storage]

    const res: IMyTableColumnProps[] = []
    storage.forEach((props) => {
      const index = slot.findIndex(({ prop }) => prop === props.prop)
      if (~index) {
        const propsFromSlot = slot[index]
        res.push({
          ...propsFromSlot,
          ...props,
        })
        slot.splice(index, 1)
      }
    })
    res.push(...slot)

    return res
  }),
})

/* 重构 slot.main */
const refactorSlot = computed(() => {
  const { main } = slots.value

  /* 对 slot.main 进行改写 */
  const refactorySlot: VNode[] = []
  columns.render.forEach(({ prop, visiable, fixed }) => {
    if (!visiable) return

    const vnode = main.find((vnode) => prop === vnode.props?.prop)
    if (!vnode) return

    const cloned = cloneVNode(vnode, {
      fixed,
    })

    refactorySlot.push(cloned)
  })

  return refactorySlot
})

/* 对外暴露的内容 */
defineExpose({
  table, // el-table 实例的访问

  columns: computed(() => readonly(columns.render)),
  updateColumns(value: IMyTableColumnProps[]) {
    columns.storage = value
  },
})

const children = () => [slots.value.left, refactorSlot.value, slots.value.other]

/* 追加功能 */
// 记录滚动条位置
useKeepScroll(computed(() => table.value?.$refs.bodyWrapper))
</script>
