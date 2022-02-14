<template>
  <div>
    <el-upload list-type="picture-card"
               :limit="1"
               action="#"
               :on-preview="preview"
               :on-remove="handleRemove"
               :on-change="changFile"
               :before-upload="beforeUpload"
               :http-request="upload"
               :file-list="fileList"
               :class="{disable: fileComputed}">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent"
                 style="width:180px"
                 :percentage="percent"></el-progress>
    <el-dialog :visible.sync="showDialog"
               title="图片预览">
      <img style="width: 100%;"
           :src="imgUrl">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID97pGPHtEI5bqoWx82f16uRhgPq0sUmnX',
  SecretKey: 'UhcHgofFYaLp2ze2A2dx0mHUQ6WfW6QT'
})
export default {
  data () {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: '',
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  methods: {
    //点击文件列表中已上传的文件时的钩子
    preview (file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      //file为移除的图片，fileList为移除后的数组
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    changFile (file, fileList) {
      //file为当前的图片，fileList最新的数组
      this.fileList = fileList.map(item => item)
    },
    //上传文件之前
    beforeUpload (file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    // 进行上传操作
    upload (params) {
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'haha-1309458651', // 存储桶
          Region: 'ap-shanghai', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          // 上传的进度回调方法
          onProgress: (params) => {
            this.percent = params.percent * 100
          },
          StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          // console.log(err || data)
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
          }
          setTimeout(() => {
            this.showPercent = false
            this.percent = 0
          }, 1000)
        })
      }
    }
  }
}
</script>

<style>
.disable .el-upload--picture-card {
  display: none;
}
</style>