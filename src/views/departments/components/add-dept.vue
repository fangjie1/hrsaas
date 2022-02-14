<template>
  <el-dialog :title="showTitle"
             :visible.sync="showDialog"
             width="30%"
             :before-close="handleClose">
    <el-form ref="deptForm"
             :model="formData"
             :rules="rules"
             label-width="120px">
      <el-form-item label="部门名称"
                    prop="name">
        <el-input v-model="formData.name"
                  style="width: 80%;"
                  placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label="部门编码"
                    prop="code">
        <el-input v-model="formData.code"
                  style="width: 80%;"
                  placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人"
                    prop="manager">
        <el-select @focus="getEmployeeSimple"
                   v-model="formData.manager"
                   style="width: 80%;"
                   placeholder="请选择">
          <el-option v-for="item in peoples"
                     :key="item.id"
                     :label="item.username"
                     :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍"
                    prop="introduce">
        <el-input v-model="formData.introduce"
                  style="width: 80%;"
                  placeholder="1-50个字符"
                  type="textarea"
                  rows="3"
                  resize="none"></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex"
            justify="center"
            slot="footer">
      <el-button size="small"
                 @click="btnCancel">取 消</el-button>
      <el-button size="small"
                 type="primary"
                 @click="btnOK">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    treeNode: {
      type: Object,
      default: null
    },

  },
  data () {
    // 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式 不能和同级部门的名字重复
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        // 新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门向已经存在这个${value}部门了`)) : callback()
    }
    // 检查组织架构编码是否重复
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式   不能算自己
        // isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' }, {
          trigger: 'blur', validator: checkNameRepeat
        }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' }, {
          trigger: 'blur', validator: checkCodeRepeat
        }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, { min: 1, max: 300, message: '部门名称长度为1-300个字符', trigger: 'blur' }]
      },
      peoples: []
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.btnCancel()
        })
        .catch(_ => { });
    },
    //获取部门详情
    async getDepartDetail (id) {
      this.formData = await getDepartDetail(id)
    },
    // 手动校验规则
    btnOK () {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑模式  调用编辑接口
            await updateDepartments(this.formData)
          } else {
            // 新增模式
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
          // 表示可以提交了
          this.$emit('addDept') // 告诉父组件 新增数据成功 重新拉取数据
          // update:props名称
          this.$emit('update:showDialog', false)
          this.btnCancel()
        }
      })
    },
    btnCancel () {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields() //清除之前的校验，重置校验字段
    },
    async getEmployeeSimple () {
      this.peoples = await getEmployeeSimple()
    }
  }
}
</script>

<style>
</style>