<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 顶部标题 -->
        <TreeTool :obj="departmentTitle" @addDept="addHandle" />
        <!-- 显示的内容 -->
        <el-tree :data="departmentContent" default-expand-all :props="defaultProps">
          <TreeTool
            slot-scope="{ data }"
            :obj="data"
            is-tool
            @delItem="getDepartmentInfo"
            @addDept="addHandle"
            @editDept="editHandle"
          />
        </el-tree>
      </el-card>

      <!-- 编辑部门弹出层 -->
      <AddDept
        ref="addDept"
        :is-show.sync="isShowDialog"
        :tree-node="node"
        @addDept="getDepartmentInfo"
      />
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
      },
      // 控制弹出层
      isShowDialog: false,
      // 选中添加子部门当前项节点信息
      node: null
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
          manager: '负责人',
          id: ''
        }
        this.departmentContent = changeListToTree(res.depts)
      })
    },

    // 控制弹出层
    addHandle(node) {
      this.isShowDialog = true
      this.node = node
    },

    // 编辑部门信息
    editHandle(info) {
      this.isShowDialog = true
      this.node = info
      // 调用子组件中的方法  获取当前部门详情
      this.$refs.addDept.editDeptInfo(info.id)
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
