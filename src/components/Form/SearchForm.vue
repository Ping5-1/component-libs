<template>
  <el-form
    ref="form"
    :class="[formClass,labelWidth==='auto'?'auto':'']"
    :model="formData"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :inline="true"
    :rules="rules"
    class="search-form"
  >
    <el-form-item
      v-for="(item, index) in formProps"
      :key="'search'+index"
      :prop="item.prop"
      :label="item.label"
      :show-message="item.showMsg"
      :rules="setItemRule(item)"
    >
      <template v-if="item.slot">
        <slot
          :name="item.slot"
        />
      </template>
      <form-item
        v-else
        :item="item"
        @item-options="reQueryItemOptions"
      />
      <!-- emitFormItemOptionsEmpty -->
    </el-form-item>

    <el-form-item
      class="button-block"
      :class="{'in-new-line':opNewLine}"
    >
      <el-button
        type="primary"
        class="search-btn"
        @click="search"
      >
        查询
      </el-button>
      <el-button
        type="danger"
        plain
        class="search-btn btn-plain"
        @click="reset"
      >
        重置
      </el-button>
      <slot name="search-slot" />
    </el-form-item>
  </el-form>
</template>

<script>
import mixin from './modules/mixin';

export default {
  name: 'SearchForm',
  components: {
    FormItem: ()=>import('./modules/FormItem.vue'),
  },
  mixins: [mixin],
  provide() {
    return {
      // 传递给form-item
      form: this
    };
  },
  model: {
    prop: 'model',
    event: 'newForm'
  },
  props: {
    // form 表单的值，注意，如果要传入model，请务必把值传递完整，不然可能会在二次编辑或重置（需要绑定初始值）时出现问题
    model: {
      type: Object,
      default: null,
      required: true
    },
    // form-item配置
    prop: {
      type: Array,
      default: ()=>[],
      required: true
    },
    // 校验规则
    rules: {
      type: Object,
      default: ()=>{}
    },
    // label所在位置，top、left、right
    labelPosition: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    // form表单类名
    formClass: {
      type: String,
      default: ''
    },
    // 操作按钮新起一行
    opNewLine: {
      type: Boolean,
      default: false
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
    },
    // 重置后搜索
    searchAfterReset: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {},// 表单数据
      formProps: [],// 表单配置
    };
  },
  watch: {
    formData: {
      handler(val) { 
        this.$emit('newForm', val);
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.initForm();
    });
  },
  methods: {
    // 表单初始化
    initForm() {
      this.formData = Object.assign({},this.model);// 表单初始化赋值
      this.formProps = Array.from(this.prop);// 表单配置初始化赋值
      this.addSelectFn(this.formProps);// 添加下拉框选项
    },
    // 搜索
    search() {
      // console.log(this.formData);
      // let params = _.omitBy(this.formData, (val)=>valueIsEmpty(val));// 去掉多余空值
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // console.log(this.formData);
          this.$emit('search', this.formData);
        } else {
          return false;
        }
      });
    },
    // 重置
    reset() {
      this.$refs.form.resetFields();
      this.$emit('reset');
      // this.formData = Object.assign({},resetObjectValue(this.formData));
      if(this.searchAfterReset) this.search();// 重置时搜索
    },
  }
};
</script>
<style lang='less' scoped>
  /* 表单 */
  .search-form {
    &.auto {
      .el-form-item__label {
        width: auto !important;
      }

      .el-form-item__content {
        margin: auto !important;
      }
    }

    .el-form-item {
      position: relative;
      margin-bottom: 10px;

      .el-form-item__label {
        // width: 100%;
        padding-right: 0;
        text-align: left;
      }

      /deep/.el-form-item__content {
        line-height: 40px;

        .el-select,
        .el-input {
          width: 100%;
        }
      }

      /deep/ .vue-treeselect__control {
        input {
          vertical-align: middle;
        }
      }

      /deep/input.el-input__inner {
        max-width: 200px;
      }

      /deep/.el-input--suffix .el-input__icon {
        line-height: 40px;
      }
    }

    .button-block.in-new-line {
      width: 100%;
    }
  }
</style>