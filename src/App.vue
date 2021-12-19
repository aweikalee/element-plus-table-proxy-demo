<template>
  <KeepAlive>
    <MyTable
      v-if="show"
      :data="data"
      ref="table"
      max-height="400"
      :style="{ maxWidth: '500px' }"
    >
      <el-table-column prop="id" label="ID" min-width="50" />

      <el-table-column prop="order" label="订单号" min-width="200" />

      <el-table-column prop="price" label="价格" min-width="100">
        <template #default="{ row }">￥{{ row.price }}</template>
      </el-table-column>

      <el-table-column prop="amount" label="总计" min-width="100">
        <template #default="{ row }">{{ row.amount }}件</template>
      </el-table-column>

      <el-table-column prop="title" label="标题" min-width="100" />
    </MyTable>
  </KeepAlive>

  <MyToolbar :table="table" />
  <el-button @click="show = !show">显隐（KeepAlive）</el-button>
</template>

<script setup lang="tsx">
import { ref, KeepAlive } from 'vue'
import * as api from './api'
import { IDataItem } from './api'

import MyTable from './components/MyTable.vue'
import MyToolbar from './components/MyToolbar.vue'

const table = ref()
const show = ref(true)

const data = ref<IDataItem[]>([])
async function fetchMore() {
  data.value = await api.list()
}
fetchMore()
</script>
