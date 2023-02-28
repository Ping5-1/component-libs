<!-- 表单项可带组合选项的表单 -->
<template>
  <el-form
    ref="normal-form"
    :class="[formClassName,!formInline?`grid-cols-${cols}`:'',formReadonly?'form-readonly':'']"
    :model="formData"
    :rules="rules"
    :label-position="labelPosition"
    :label-width="labelWidth"
    class="v-form"
    :inline="formInline"
    :disabled="formReadonly"
  >
    <template v-for="(item,index) in formProps">
      <div
        v-if="item.title"
        :key="'title'+index"
        class="form-title"
      >
        {{ item.title }}
      </div>
      <el-form-item
        v-else-if="!item.hidden"
        :key="'item'+index"
        :prop="item.prop"
        :label="item.label"
        :rules="setItemRule(item)"
        :show-message="item.showMsg"
        :class="[{'in-new-line':item.inNewLine},{'full-line':item.full}]"
      >
        <!-- 自定义插槽 -->
        <template v-if="item.slot">
          <slot
            :name="item.slot"
            :item="formData[item.prop]"
          />
        </template>
        <!-- 单个表单项 -->
        <template v-else-if="!item.props">
          <form-single-item
            v-if="!item.hidden"
            :item="item"
            @item-options="reQueryItemOptions(item);emitFormItemOptionsEmpty(item)"
          />
        </template>
        <!-- 组合型 -->
        <div
          v-else
          class="grid"
        >
          <el-form-item
            v-for="(it, i) in item.props"
            :key="i"
            :prop="it.prop"
            :class="{'hidden':it.hidden}"
            :rules="setItemRule(it)"
          >
            <form-single-item
              v-if="!it.hidden&&!it.slot"
              :item="it"
              @item-options="reQueryItemOptions"
            />
            <template v-if="!it.hidden&&it.slot">
              <slot :name="it.slot" />
            </template>
          </el-form-item>
        </div>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import mixin from './modules/mixin';

export default {
  name: 'NormalForm',
  components: {
    FormSingleItem: ()=>import('./modules/FormItem.vue'),
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
    // form 表单的值
    model: {
      type: Object,
      default: ()=>{},
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
      default: 'right'
    },
    // label宽度
    labelWidth: {
      type: String,
      default: 'auto'
    },
    // form表单类名
    formClassName: {
      type: String,
      default: ''
    },
    // 列数
    cols: {
      type: Number,
      default: 1
    },
    // 表单是否横向排布
    formInline: {
      type: Boolean,
      default: false
    },
    // 表单是否只读
    formReadonly: {
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
        // 联动规则
        this.formProps.forEach((item) =>{
          if (item.link) {
            this.handleHidden(item.prop,item.link,item.linkFn);
          }
          if(item.props) {
            item.props.forEach((it)=>{
              if(it.link) {
                this.handleHidden(it.prop,it.link,it.linkFn);
              }
            });
          }
        });
        this.$emit('newForm', val);
      },
      deep: true
    },
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
      this.resetFields();// 初始化时不进行校验
      // 添加下拉框选项
      this.addSelectFn(this.formProps);
      this.formProps.forEach((item)=> {
        if(item.props) {
          this.addSelectFn(item.props);
        }
      });
    },
    // 表单校验
    validate() {
      let isValidate = false;
      this.$refs['normal-form'].validate((valid) => {
        isValidate = valid;
      });
      return isValidate;
    },
    validateField(field) {
      this.$refs['normal-form'].validateField(field);
    },
    // 重置表单校验
    resetFields() {
      this.$refs['normal-form'].resetFields();
    },
    // 重置到初始状态
    clickReset() {
      this.$refs['normal-form'].resetFields();
      this.$emit('reset');
      // if(this.searchAfterReset) this.search();// 重置时搜索
    },
    // 重置并清空初始值
    reset() {
      this.$refs['normal-form'].resetFields();
      this.formData = Object.assign({},this.resetObjectValue(this.formData));
    },
    /**
     * @description: 控制联动项的显隐
     * @param {*} item 联动项
     */    
    handleHidden(prop,link,linkFn) {
      if(link && typeof linkFn === 'function') {
        const hidden = linkFn(this.formData[prop]);
        link.forEach((it,j)=>{
          // this.handleItemChange(it,{hidden: hidden,required: !hidden});
          this.handleItemChange(it,hidden[j]);
        });
      }
    },
    /**
     * @description:  设置form项的显示隐藏，并清除该项的required
     * @param {Number} propName 表单项的prop
     * @param {Boolean} hidden 是否隐藏,true为隐藏
     */ 
    hiddenItem(propName,hidden) {
      this.handleItemChange(propName,{hidden: hidden,required: !hidden});
    },
    /**
     * @description: 设置 forn项目的相关属性
     * @param {*} propName 表单项的prop
     * @param {Object} attrs 属性设置
     */    
    handleItemChange(propName,attrs) {
      let [itemIndex,propIndex] = [-1,-1];
      if(Array.isArray(propName)) {
        [itemIndex,propIndex] = propName;
      }
      else{
        [itemIndex,propIndex] = this.getFormItemIndex(propName);
      }
      // 设置多余属性
      if(attrs) {
        let keys = Object.keys(attrs);
        keys.forEach((key)=>{
          if(propIndex === -1) {
            this.$set(this.formProps[itemIndex],key,attrs[key]);
          }
          else {
            this.$set(this.formProps[itemIndex].props[propIndex],key,attrs[key]);
          }
        });
        this.formProps = [...this.formProps];// 触发更新
      }
    },

  }
};
</script>
<style lang='less' scoped>
  @import "./Form.less";
</style>