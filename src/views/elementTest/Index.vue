<template>
  <div class="element-panel">
    <el-calendar v-model="calendar" />
    <div class="">
      <el-button type="default">
        按钮
      </el-button>
      <el-button type="primary">
        按钮
      </el-button>
      <el-button type="success">
        按钮
      </el-button>
      <el-button type="warning">
        按钮
      </el-button>
      <el-button type="danger">
        按钮
      </el-button>
      <el-button type="info">
        按钮
      </el-button>
      <el-button type="text">
        按钮
      </el-button>
      <el-button
        type="default"
        plain
      >
        按钮
      </el-button>
      <el-button
        type="primary"
        plain
      >
        按钮
      </el-button>
      <el-button
        type="success"
        plain
      >
        按钮
      </el-button>
      <el-button
        type="warning"
        plain
      >
        按钮
      </el-button>
      <el-button
        type="danger"
        plain
      >
        按钮
      </el-button>
      <el-button
        type="info"
        plain
      >
        按钮
      </el-button>
      <el-button
        type="text"
        plain
      >
        按钮
      </el-button>
      <el-radio-group v-model="radio">
        <el-radio :label="3">
          备选项
        </el-radio>
        <el-radio :label="6">
          备选项
        </el-radio>
      </el-radio-group>
      <el-radio-group v-model="radio">
        <el-radio-button label="北京" />
        <el-radio-button label="广州" />
      </el-radio-group>
      <div class="alert-panel">
        <el-alert
          title="成功提示的文案"
          type="success"
        />
        <el-alert
          title="消息提示的文案"
          type="info"
          show-icon
        />
        <el-alert
          title="警告提示的文案"
          type="warning"
          show-icon
          close-text="知道了"
        />
        <el-alert
          title="错误提示的文案"
          type="error"
        />
        <el-alert
          title="成功提示的文案"
          type="success"
          effect="dark"
        />
        <el-alert
          title="消息提示的文案"
          type="info"
          effect="dark"
        />
        <el-alert
          title="警告提示的文案"
          type="warning"
          effect="dark"
          show-icon
          close-text="知道了"
        />
        <el-alert
          title="错误提示的文案"
          type="error"
          effect="dark"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElementTest',
  components: {},
  data() {
    return {
      radio: 3,
      calendar: new Date()
    };
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang='less' scoped>
.element-panel{
    padding: 20px;
    display: grid;
    grid-template-columns:30% 70%;
    gap: 10px;
}
.alert-panel{
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(4,22%);
    gap: 10px;
}
</style>