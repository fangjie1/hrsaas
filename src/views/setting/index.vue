<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane v-loading="loading"
                       label="角色管理"
                       name="role">
            <el-row style="height:60px">
              <el-button type="primary"
                         icon="el-icon-plus"
                         size="small"
                         @click="showDialog=true">新增角色</el-button>
            </el-row>
            <el-table :data="list"
                      border
                      style="width: 100%">
              <el-table-column type="index"
                               align="center"
                               label="序号"
                               width="120">
              </el-table-column>
              <el-table-column prop="name"
                               align="center"
                               label="名称"
                               width="240">
              </el-table-column>
              <el-table-column prop="description"
                               align="center"
                               label="描述">
              </el-table-column>
              <el-table-column label="操作"
                               align="center"
                               width="300">
                <template v-slot="{row}">
                  <el-button size="small"
                             type="success"
                             @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small"
                             type="primary"
                             @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small"
                             type="danger"
                             @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex"
                    justify="center"
                    align="middle"
                    style="height: 60px">
              <el-pagination layout="prev,pager,next"
                             :total="page.total"
                             :page-size="page.pagesize"
                             :current-page="page.page"
                             @current-change="changePage"></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息"
                       name="company">
            <el-alert type="info"
                      :show-icon="true"
                      :closable="false"
                      title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"></el-alert>

            <el-form class="formData"
                     label-width="120px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name"
                          disabled
                          style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress"
                          disabled
                          style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone"
                          disabled
                          style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox"
                          disabled
                          style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks"
                          type="textarea"
                          disabled
                          resize="none"
                          style="width:400px"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog @close="btnCancel"
               title="新增角色"
               :visible="showDialog">
      <el-form ref="roleForm"
               label-width="120px"
               :model="roleForm"
               :rules="rules">
        <el-form-item label="角色名称"
                      prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex"
              justify="center">
        <el-col :span="8">
          <el-button size="small"
                     @click="btnCancel">取消</el-button>
          <el-button type="primary"
                     size="small"
                     @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="分配权限"
               :visible="showPermDialog"
               @close="btnPermCancel">
      <el-tree ref="permTree"
               node-key="id"
               :data="permData"
               :props="defaultProps"
               :default-expand-all="true"
               show-checkbox
               :check-strictly="true"
               :default-checked-keys="selectCheck"></el-tree>
      <el-row slot="footer"
              type="flex"
              justify="center">
        <el-col>
          <el-button type="primary"
                     size="small"
                     @click="btnPermOK">确定</el-button>
          <el-button type="primary"
                     size="small"
                     @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, deleteRole, updateRole, getRoleDetail, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  computed: {
    ...mapGetters(['companyId'])
  },
  data () {
    return {
      activeName: 'role',
      list: [],
      page: {
        page: 1,
        pagesize: 10,//每页显示的条目 
        total: 0 //记录总数
      },
      formData: {
        // 公司信息
        name: '我心永恒科技股份有限公司'
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      loading: false,
      showPermDialog: false,
      permData: [],
      defaultProps: {
        label: 'name'
      },
      roleId: '',
      selectCheck: []
    }
  },
  created () {
    this.getRoleList()
    // this.getCompanyInfo()
  },
  methods: {
    // 获取所有角色
    async getRoleList () {
      this.loading = true
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 改变页码
    changePage (newPage) {
      // newPage为当前点击的页码
      this.page.page = newPage
      this.getRoleList()
    },
    // async getCompanyInfo () {
    //   this.formData = await getCompanyInfo(this.companyId)
    // },
    // 删除角色
    async deleteRole (id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id)
        await this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error);
      }
    },
    // 编辑角色
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 新增角色
    async btnOK () {
      try {

        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          addRole(this.roleForm)
        }
        await this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false //关闭弹层会触发el-dialog的close事件
      } catch (error) {
      }
    },
    btnCancel () {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },

    //分配权限
    async assignPerm (id) {
      const result = await getPermissionList()
      this.permData = transListToTreeData(result, '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async btnPermOK () {
      // 调用el-tree的方法
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel () {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style>
.formData {
  margin-top: 15px;
}
</style>
