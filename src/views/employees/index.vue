<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{page.total}}条记录</span>
        <template v-slot:after>
          <el-button size="small"
                     type="success"
                     @click="$router.push('./import')">excel导入</el-button>
          <el-button size="small"
                     type="danger"
                     @click="exportData">excel导出</el-button>
          <el-button size="small"
                     type="primary"
                     @click="showDialog=true"
                     :disabled="!checkPermission('POINT-USER-ADD')">新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading">
        <el-table :data="list"
                  border>
          <el-table-column align="center"
                           label="序号"
                           sortable=""
                           type="index"
                           width="50px" />
          <el-table-column align="center"
                           label="姓名"
                           sortable=""
                           prop="username" />
          <el-table-column width="120px"
                           align="center"
                           label="头像"
                           sortable=""
                           prop="username">
            <template v-slot="{row}">
              <img @click="showQrCode(row.staffPhoto)"
                   v-imagerror="require('@/assets/common/bigUserHeader.png')"
                   :src="row.staffPhoto"
                   style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                   alt="">
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="工号"
                           sortable=""
                           prop="workNumber" />
          <el-table-column align="center"
                           label="聘用形式"
                           sortable=""
                           prop="formOfEmployment"
                           :formatter="formatEmployment" />
          <el-table-column align="center"
                           label="部门"
                           sortable=""
                           prop="departmentName" />
          <el-table-column align="center"
                           label="入职时间"
                           sortable=""
                           prop="timeOfEntry">
            <template v-slot="obj">
              {{obj.row.timeOfEntry |formatDate}}
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="账户状态"
                           sortable=""
                           prop="enableState">
            <template v-slot="{row}">
              <el-switch :value="row.enableState===1"
                         active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="操作"
                           sortable=""
                           fixed="right"
                           width="280">
            <template v-slot={row}>
              <el-button type="text"
                         size="small"
                         @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text"
                         size="small">转正</el-button>
              <el-button type="text"
                         size="small">调岗</el-button>
              <el-button type="text"
                         size="small">离职</el-button>
              <el-button type="text"
                         size="small"
                         @click="editRole(row.id)">角色</el-button>
              <el-button type="text"
                         size="small"
                         @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex"
                justify="center"
                align="middle"
                style="height: 60px;">
          <el-pagination layout="prev,pager,next"
                         :total="page.total"
                         :page-size="10"
                         :current-page="page.page"
                         @current-change="changePage"></el-pagination>
        </el-row>
      </el-card>
    </div>
    <AddEmployee :showDialog.sync="showDialog" />
    <el-dialog width="460px"
               title="二维码"
               :visible.sync="showCodeDialog">
      <el-row type="flex"
              justify="center">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>
    <AssignRole ref="assignRole"
                :showRoleDialog.sync="showRoleDialog"
                :userId="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  name: 'Employees',
  data () {
    return {
      showCodeDialog: false,
      loading: false,
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  components: {
    AddEmployee,
    AssignRole
  },
  created () {
    // 获取员工列表
    this.getEmployeeList()
  },
  methods: {
    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    formatEmployment (row, column, cellValue) {
      const obj = EmployeeEnum.hireType.find(item => item.id == cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee (id) {
      try {
        await this.$confirm('确定删除该员工吗')
        console.log(this.list.length);
        if (this.list.length === 1 && this.page.page != 1) {
          this.page.page = this.page.page - 1
        }
        await delEmployee(id)
        console.log(this);
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error);
      }
    },
    // 导出excel
    exportData () {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头 必填
          data, //具体数据 
          filename: '员工资料表', //非必填，文件名
          autoWidth: true, //非必填，单元格是否要自适应宽度
          bookType: 'xlsx', //非必填，导出文件类型
          multiHeader, // 多行表头
          merges //合并选项
        })
      })
    },
    //将表头与数据对应
    formatJson (headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id == item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(Headers).map(key => item[headers[key]]))
    },
    showQrCode (url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message('该用户还未上传头像')
      }
    },
    async editRole (id) {
      this.userId = id // props传值 是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    }
  }
}


</script>

<style>
</style>
