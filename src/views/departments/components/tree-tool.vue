<template>
  <el-row type="flex" justify="space-between" align="middle" style="width: 100%;height: 40px">
    <!-- 左 -->
    <el-col>
      {{ obj.name }}
    </el-col>
    <!-- 右 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          {{ obj.manager }}
        </el-col>
        <!-- 下拉菜单 -->
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isTool" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isTool">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>

  </el-row>
</template>

<script>
export default {
  name: 'TreeTool',
  props: {
    obj: {
      type: Object,
      required: true
    },
    isTool: {
      type: Boolean,
      default: false
    }
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
    // 编辑 添加 删除   事件
    handleCommand(type) {
      if (type === 'add') {
        // 添加

      } else if (type === 'edit') {
        // 编辑
      } else {
        // 删除
        this.$http({
          method: 'delete',
          url: `/company/department/${this.obj.id}`
        }).then(() => {
          return this.$confirm('此操作将永久删除，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('delItem')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
