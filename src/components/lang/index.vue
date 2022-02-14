<template>
  <el-dropdown trigger="click"
               @command="changeLanguage">
    <!-- 这里必须加一个div -->
    <div>
      <svg-icon style="color:#fff;font-size:20px"
                icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh"
                        :disabled="'zh'=== $store.state.user.lang ">中文</el-dropdown-item>
      <el-dropdown-item command="en"
                        :disabled="'en'=== $store.state.user.lang ">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  methods: {
    changeLanguage (lang) {
      this.$store.commit('user/changLang', lang)
      this.$i18n.locale = this.$store.state.user.lang
      this.$message.success('切换多语言成功')
    }
  }
}
</script>