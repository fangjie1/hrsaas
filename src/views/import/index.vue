<template>
  <UploadExcel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success ({ results }) {
      try {
        const userRelations = {
          '手机号': 'mobile',
          '姓名': 'username',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '工号': 'workNumber',
          '部门': 'departmentName',
          '转正日期': 'correctionTime',
        }
        const arr = results.map(item => {
          const userInfo = {}
          Object.keys(item).forEach(key => {
            //格式化时间
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
              return
            }
            userInfo[userRelations[key]] = item[key]
          })
          return userInfo
        })
        await importEmployee(arr) // 调用导入接口
        this.$message.success('导入excel成功')
        this.$router.back()
      } catch (error) {

      }
    },
    // 转换excel日期格式
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>
</style>