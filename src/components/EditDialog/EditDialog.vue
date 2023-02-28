<template>
  <el-dialog
    :custom-class="customClass+' edit-dialog-page '+(isDarkTheme?'dark':'light')"
    :title="title"
    :visible.sync="tDialogVisible"
    :width="width"
    :append-to-body="appendToBody"
    :fullscreen="fullscreen"
    :top="top"
    :center="center"
    :close-on-click-modal="closeOnClickModel"
    destroy-on-close
    @open="open"
    @opened="opened"
    @close="close"
  >
    <slot />
    <div
      v-if="showBottomBtn"
      slot="footer"
      class="dialog-footer"
      :class="bottomClass"
    >
      <el-button
        v-if="showCancel"
        class="cancel"
        isplain
        type="danger"
        @click="tDialogVisible = false"
      >
        取消
      </el-button>
      <slot name="dialog-button" />
      <el-button
        v-if="showContinue"
        class="commit"
        type="primary"
        @click="continueWork"
      >
        提交并继续添加
      </el-button>
      <el-button
        v-if="showSubmit"
        class="commit"
        type="primary"
        @click="submit"
      >
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: String,
      default: '65%' // Dialog 的宽度
    },
    appendToBody: {
      type: Boolean,
      default: false // Dialog 自身是否插入至 body 元素上
    },
    fullscreen: {
      type: Boolean,
      default: false // 是否为全屏 Dialog
    },
    top: {
      type: String,
      default: '15vh' // Dialog CSS 中的 margin-top 值
    },
    center: {
      type: Boolean,
      default: false // 是否对头部和底部采用居中布局
    },
    closeOnClickModel: {
      type: Boolean,
      default: false // 是否可以通过点击 modal 关闭 Dialog
    },
    showCancel: {
      type: Boolean,
      default: true // 是否显示取消按钮
    },
    showSubmit: {
      type: Boolean,
      default: true // 是否显示确定按钮
    },
    showContinue: {
      type: Boolean,
      default: false // 是否显示提交并继续添加按钮
    },
    showBottomBtn: {
      type: Boolean,
      default: true // 是否显示底部按钮
    },
    bottomClass: {
      type: String,
      default: ''// 底部按钮样式
    },
    isDarkTheme: {
      type: Boolean,
      default: true // 是否是暗色主题
    },
    customClass: {
      type: String,
      default: ''// 自定义样式
    }
  },
  data() {
    return {
      tDialogVisible: this.dialogVisible
    };
  },
  watch: {
    dialogVisible: function (n) {
      this.tDialogVisible = n;
    },
    tDialogVisible(n) {
      this.$emit('update:dialogVisible',n);
    }
  },
  methods: {
    /**
     * 打开弹窗
     */
    open() {
      this.$emit('open');
    },
    /**
     * 打开弹窗之后
     * */
    opened() {
      this.$emit('opened');
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.$emit('close');
    },
    /**
     * 提交
     */
    submit() {
      this.$emit('submit');
    },
    /**
     * 提交并继续添加
     */
    continueWork() {
      this.$emit('continueWork');
    }
  }
};
</script>

<style scoped lang="less">
  @import "EditDialog";
</style>
