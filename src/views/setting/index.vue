<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <div class="userInfo">
              <!-- 新增角色按钮 -->
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="isShowDialog = true"
              >新增角色
              </el-button>

              <!-- 表格 数据 -->
              <el-table border style="margin-top: 10px;" :data="userInfoList">
                <el-table-column label="序号" width="120" type="index" />
                <el-table-column label="角色名" width="240" prop="name" />
                <el-table-column label="描述" prop="description" />
                <el-table-column label="操作">
                  <template slot-scope="{ row }">
                    <el-button type="primary" size="mini">分配权限</el-button>
                    <el-button type="warning" size="mini" @click="editRole(row.id)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteRole(row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
              <el-row type="flex" justify="end" align="middle" style="height: 44px">
                <el-pagination
                  layout="prev, pager, next"
                  :total="total"
                  @current-change="pageHandle"
                />
              </el-row>
            </div>
          </el-tab-pane>

          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-form :model="companyInfo" label-width="120px" style="margin-top: 20px">
              <!-- 企业名称 -->
              <el-form-item label="企业名称">
                <el-input v-model="companyInfo.name" disabled style="width: 400px" />
              </el-form-item>
              <!-- 公司地址 -->
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <!-- 公司电话 -->
              <el-form-item label="公司电话">
                <el-input v-model="companyInfo.companyPhone" disabled style="width: 400px" />
              </el-form-item>
              <!-- 邮箱 -->
              <el-form-item label="邮箱">
                <el-input v-model="companyInfo.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <!-- 备注 -->
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" disabled style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 编辑弹出层 -->
      <el-dialog title="编辑部门" :visible="isShowDialog" @close="cancel">
        <el-form ref="roleForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="formData.description" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 角色信息列表
      userInfoList: [],
      // 分页
      userInfoPage: {
        page: 1,
        pagesize: 10
      },
      // 总条数
      total: 0,
      // 公司信息
      companyInfo: {},
      // 控制修改弹出层
      isShowDialog: false,
      // 编辑部门表单信息
      formData: {
        name: '',
        description: ''
      },
      // 编辑部门表单信息 校验规则
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getUserInfoList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色信息列表
    getUserInfoList() {
      this.$http({
        url: '/sys/role',
        params: this.userInfoPage
      }).then(res => {
        this.userInfoList = res.rows
        this.total = res.total
      })
    },

    // 分页事件
    pageHandle(curPage) {
      this.userInfoPage.page = curPage

      // 获取当前页的数据
      this.getUserInfoList()
    },

    // 获取公司信息
    getCompanyInfo() {
      this.$http({
        url: `/company/${this.companyId}`
      }).then(res => {
        this.companyInfo = res
      })
    },

    // 删除角色
    deleteRole(id) {
      this.$http({
        url: `/sys/role/${id}`,
        method: 'DELETE'
      }).then(res => {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 获取最新的数据
          this.getUserInfoList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {})
      })
    },

    // 编辑角色
    editRole(id) {
      // 获取当前项数据  根据ID获取角色详情
      this.$http({
        url: `/sys/role/${id}`
      }).then(res => {
        this.formData = res

        // 显示弹出层
        this.isShowDialog = true
      })
    },

    // 新增  编辑  表单
    submitForm() {
      this.$refs.roleForm.validate().then(() => {
        // 有  id 编辑   无 id 新增
        if (this.formData.id) {
          // 编辑
          this.$http({
            url: `/sys/role/${this.formData.id}`,
            method: 'PUT',
            data: this.formData
          }).then(() => {
            // 关闭弹出层
            this.isShowDialog = false
            this.$message({ type: 'success', message: '修改成功' })
          })
        } else {
          // 新增
          this.$http({
            url: '/sys/role',
            method: 'POST',
            data: this.formData
          }).then(() => {
            // 关闭弹出层
            this.isShowDialog = false
            this.$message({ type: 'success', message: '新增成功' })
          })
        }

        // 更新数据
        this.getUserInfoList()
      }).catch(() => {})
    },

    // 取消
    cancel() {
      this.isShowDialog = false
      // 清空表单
      this.formData = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.userInfo {
  padding: 30px;
}
</style>
