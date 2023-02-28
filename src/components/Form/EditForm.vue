<template>
  <edit-dialog
    :title="title"
    :dialog-visible="dialogVisible"
    :width="width"
    :top="top"
    :append-to-body="true"
    :show-continue="showContinue"
    :show-bottom-btn="showBottomBtn"
    :show-cancel="showCancel"
    :bottom-class="bottomClass"
    :is-dark-theme="isDarkTheme"
    @open="open"
    @close="close"
    @submit="submit"
    @continueWork="continueWork"
  >
    <template #dialog-button>
      <el-button
        v-if="showReset"
        type="danger"
        @click="reset"
      >
        重置
      </el-button>      
    </template>
    <el-form
      ref="edit-form"
      :model="formData"
      :rules="rules"
      :class="'edit-form-page '+className"
      :validate-on-rule-change="false"
      :label-width="labelWidth"
    >
      <div
        v-for="(item, index) in fields"
        :key="'dialog-block-form-list' + index"
        class="dialog-block"
      >
        <!-- <span class="text-white">{{ item.prop+" "+formData[item.prop] }}</span> -->
        <div
          v-if="item.title"
          class="dialog-block-title"
        >
          {{ item.title }}
        </div>
        <el-form-item
          v-else
          :label="item.label"
          :prop="item.prop"
          :rules="setItemRule(item)"
        >
          <form-item
            :key="'form-item' + index" 
            :item="item"
            @item-options="reQueryItemOptions"
          />
        </el-form-item>
      </div>
    </el-form>
  </edit-dialog>
</template>

<script>
import { resetObjectValue } from '@/utils/util';
import mixin from './modules/mixin';// 表单公共mixin混合

export default {
  name: 'EditForm',
  components: {
    EditDialog: () => import('@/components/EditDialog/EditDialog'),
    FormItem: ()=>import('./modules/FormItem.vue'),
  },
  mixins: [mixin],
  /* provide()只在初始化时调用一次,先于mounted执行。 需要传一个响应式数据
  因为formData外部已无其余东西包裹，且层级较深，故此处传this
  */
  provide() {
    return {
      // 传递给form-item
      form: this
    };
  },
  props: {
    // form 表单的值
    model: {
      type: Object,
      default: null,
      required: true
    },
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: String,
      default: '60%' // Dialog 的宽度
    },
    top: {
      type: String,
      default: '15vh' // Dialog CSS 中的 margin-top 值
    },
    fields: {
      type: Array,
      required: true,
    },
    showBottomBtn: {
      type: Boolean,
      default: true // 是否显示底部按钮
    },
    showCancel: {
      type: Boolean,
      default: true // 是否显示重置按钮
    },
    showReset: {
      type: Boolean,
      default: false // 是否显示重置按钮
    },
    showContinue: {
      type: Boolean,
      default: false // 是否显示提交并继续添加按钮
    },
    bottomClass: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    rules: {
      type: Object,
      default: ()=>{}
    },
    // 不使用默认placeholder
    noPlaceHolder: {
      type: Boolean,
      default: false
    },
    // 深色主题
    isDarkTheme: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      formData: {},
      formProps: [],
    };
  },
  methods: {
    // 打开弹窗
    open() {
      const propKeys = Array.from(this.fields,({prop})=>prop);
      this.formProps = Array.from(this.fields);// 表单配置初始化赋值

      this.$nextTick(() => {
        propKeys.forEach((key)=>{
          if(this.formData[key]) delete this.formData[key];
          this.$set(this.formData, key, this.model[key]);
        });
        this.addSelectFn(this.formProps);// 添加下拉框选项
        this.dialogVisible = true;
        if (this.$refs['edit-form'] !== undefined) {
          this.$refs['edit-form'].clearValidate();
        }
      });
    },
    // 关闭弹窗
    close() {
      // 清空数据
      this.resetFields();
      this.$emit('close');
      this.dialogVisible = false;
    },
    // 提交
    submit() {
      this.$refs['edit-form'].validate((valid) => {
        if (valid) {
          // console.log(this.formData);
          this.$emit('dialogSubmit', this.formData);
        } else {
          return false;
        }
      });
    },
    // 提交并继续添加
    continueWork() {
      this.$refs['edit-form'].validate((valid) => {
        if (valid) {
          this.$emit('continueWork', this.formData);
        } else {
          return false;
        }
      });
    },
    // 重置表单校验
    resetFields() {
      resetObjectValue(this.formData);
      this.$refs['edit-form'].clearValidate();
    },
    // 重置
    reset() {
      this.$refs['edit-form'].resetFields();
    },
  }
};
</script>

<style lang="less" scoped>
  @import "./Form.less";
</style>
