<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 顶部标题 -->
        <TreeTool :obj="departmentTitle" />
        <!-- 显示的内容 -->
        <el-tree :data="departmentContent" default-expand-all :props="defaultProps">
          <TreeTool slot-scope="{ data }" :obj="data" is-tool @delItem="getDepartmentInfo" />
        </el-tree>
      </el-card>

      <!-- 编辑部门弹出层 -->
      <AddDept />
    </div>
  </div>
</template>

<script>
import TreeTool from './components/tree-tool'
import { changeListToTree } from '@/utils'
import AddDept from './components/add-dept'
export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      // 标题
      departmentTitle: {},
      // 内容
      departmentContent: [],
      // 默认属性
      defaultProps: {
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartmentInfo()
  },
  methods: {
    // 获取企业的部门列表
    getDepartmentInfo() {
      this.$http({
        url: '/company/department'
      }).then(res => {
        this.departmentTitle = {
          name: res.companyName,
          manager: '负责人'
        }
        this.departmentContent = changeListToTree(res.depts)
      })
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
