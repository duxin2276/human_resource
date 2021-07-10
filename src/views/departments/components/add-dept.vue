<template>
  <!-- 编辑部门弹出层 -->
  <el-dialog :title="showTitle" :visible="isShow" @close="cancel">
    <!-- 表单区域 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="100px">
      <!-- 部门名称 -->
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1~50个字符" />
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1~50个字符" />
      </el-form-item>
      <!-- 部门负责人 -->
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getLeaderList">
          <el-option
            v-for="item in leaderList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <!-- 部门介绍 -->
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" placeholder="1~300个字符" />
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
    // 控制弹出层
    isShow: {
      type: Boolean,
      required: true
    },
    // 选中当前节点信息
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 校验同级部门下是否有相同的部门
    const checkNameRepeat = (rule, value, callback) => {
      // 获取最新的组织架构信息
      this.$http({
        url: '/company/department'
      }).then(({ depts }) => {
        let result
        if (this.formData.id) {
          // 编辑
          // 先排除掉自己  再进行校验
          result = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
            .some(item => item.name === value)
        } else {
          // 新增
          result = depts.filter(item => item.pid === this.treeNode.pid).some(item => item.name === value)
        }
        result ? callback(new Error(`同级部门下已经有${value}部门了`)) : callback()
      })
    }

    // 校验组织架构下是否有相同的编码
    const checkCodeRepeat = (rule, value, callback) => {
      // 获取最新的组织架构信息
      this.$http({
        url: '/company/department'
      }).then(({ depts }) => {
        let result
        if (this.formData.id) {
          // 编辑
          // 先排除掉自己   再进行校验   考虑到历史数据中可能没有code  加一个强制条件  处理历史数据兼容性
          result = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
        } else {
          // 新增
          result = depts.some(item => item.code === value && value)
        }
        result ? callback(new Error(`组织架构下已经有${value}编码了`)) : callback()
      })
    }

    return {
      // 传给后端的数据
      formData: {
        code: '',
        introduce: '',
        manager: '',
        name: ''
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: '部门名称为必填项', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码为必填项', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人为必选项', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门编码为必填项', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ]
      },
      // 负责人数据
      leaderList: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '添加子部门'
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    // 获取全部负责人
    getLeaderList() {
      this.$http({
        url: '/sys/user/simple'
      }).then(res => {
        this.leaderList = res
      })
    },

    // 新增部门
    submitForm() {
      // 有id时  编辑   无id时  添加
      const { id } = this.formData
      const config = {
        url: `company/department${id ? '/' + id : ''}`,
        method: id ? 'PUT' : 'POST',
        data: id ? this.formData : { ...this.formData, pid: this.treeNode.id }
      }
      console.log('配置项：', config)
      this.$refs.deptForm.validate(status => {
        status && this.$http(config).then(() => {
          this.$emit('addDept')

          // 关闭弹出层  语法糖  update: props
          this.$emit('update:isShow', false)
        }).catch(reason => {
          console.log('请求失败：', reason)
        })
      })
    },

    // 取消操作
    cancel() {
      // resetFields 只能重置表单中的数据  不能清除掉表单之外的数据  需要手动重置
      this.formData = {
        code: '',
        introduce: '',
        manager: '',
        name: ''
      }

      this.$emit('update:isShow', false)

      // 清空表单
      this.$refs.deptForm.resetFields()
    },

    // 编辑当前部门信息
    editDeptInfo(id) {
      this.$http({
        url: `/company/department/${id}`
      }).then(res => {
        this.formData = res
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
