<template>
  <el-dropdown trigger="click">
    <el-button type="primary">动态列</el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <div class="my-table-toolbar">
          <VueDraggableNext v-model="columns" item-key="prop">
            <div
              class="my-table-toolbar__item"
              v-for="(element, index) in columns"
            >
              <el-checkbox
                :model-value="element.visiable"
                @change="toggleVisiable(element, index)"
                >{{ element.label }}</el-checkbox
              >

              <el-button
                :type="element.fixed === 'left' ? 'primary' : 'default'"
                size="mini"
                @click="setFixed(element, index, 'left')"
                >左固定</el-button
              >
              <el-button
                :type="element.fixed === 'right' ? 'primary' : 'default'"
                size="mini"
                @click="setFixed(element, index, 'right')"
                >右固定</el-button
              >
            </div>
          </VueDraggableNext>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { IMyTableColumnProps } from './MyTable.vue'

const props = defineProps({
  table: Object,
})

const columns = computed<IMyTableColumnProps[]>({
  get() {
    return props.table?.columns ?? []
  },
  set(value) {
    props.table?.updateColumns(value)
  },
})

function toggleVisiable(data: IMyTableColumnProps, index: number) {
  const newData = { ...data }
  const _columns = columns.value.slice()
  newData.visiable = !newData.visiable
  _columns[index] = newData
  props.table?.updateColumns(_columns)
}

function setFixed(
  data: IMyTableColumnProps,
  index: number,
  value: 'left' | 'right'
) {
  const newData = { ...data }
  const _columns = columns.value.slice()
  const oldFixed = newData.fixed
  if (oldFixed) {
    if (oldFixed === value) {
      newData.fixed = false
    } else {
      newData.fixed = oldFixed === 'left' ? 'right' : 'left'
    }
  } else {
    newData.fixed = value
  }
  _columns[index] = newData
  props.table?.updateColumns(_columns)
}
</script>

<style lang="less" scoped>
.my-table-toolbar {
  &__item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    :deep(.el-checkbox) {
      margin-right: 10px;
    }
  }

  &__fixed {
    cursor: pointer;
  }
}
</style>
