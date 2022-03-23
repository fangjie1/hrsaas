<template>
  <div v-loading="loading"
       class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTools :tree-node="company"
                   :is-root="true"
                   @addDept="addDept" />
        <el-tree :data="departs"
                 :props="defaultProps"
                 :default-expand-all="true">
          <TreeTools slot-scope="{data}"
                     :tree-node="data"
                     @delDept="getDepartments"
                     @addDept="addDept"
                     @editDept="editDept" />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDept"
             :show-dialog.sync="showDialog"
             :tree-node="node"
             @addDept="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data () {
    return {
      departs: [],
      // departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
      // { name: '行政部', manager: '刘备' },
      // { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: {},
      showDialog: false,
      node: null,
      loading: false
    }
  },
  created () {
    this.getDepartments()
  },
  methods: {
    async getDepartments () {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: '我心永恒科技股份有限公司', manager: '负责人', id: '' }
      this.departs = transListToTreeData(result.depts, '')
      this.loading = false
    },
    addDept (node) {
      // 显示新增部门弹层
      this.showDialog = true
      this.node = node
    },
    editDept (node) {
      // 展示编辑部门弹层
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(this.node.id)
    }
  }
}

</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
