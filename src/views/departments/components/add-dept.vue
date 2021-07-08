<template>
  <!-- 编辑部门弹出层 -->
  <el-dialog title="编辑部门" :visible="true">
    <!-- 表单区域 -->
    <el-form label-width="82px">
      <!-- 部门名称 -->
      <el-form-item label="部门名称">
        <el-input placeholder="1~50个字符" />
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item label="部门编码">
        <el-input placeholder="1~50个字符" />
      </el-form-item>
      <!-- 部门负责人 -->
      <el-form-item label="部门负责人">
        <el-select placeholder="请选择" />
      </el-form-item>
      <!-- 部门介绍 -->
      <el-form-item label="部门介绍">
        <el-input placeholder="1~300个字符" />
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  components: {

  },
  data() {
    return {

    }
  },
  mounted() {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
