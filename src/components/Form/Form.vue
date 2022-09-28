<!--
 * @Author: ypW
 * @objectDescription: 视频资源管理
 * @Date: 2022-08-31 17:43:38
 * @LastEditors: ypW
 * @LastEditTime: 2022-09-08 16:48:58
 * @FilePath: \system-video\src\views\components\Form\Form.vue
 * @Version: 1.0.0
-->
<template>
  <el-form
    ref="form"
    :class="formClassName"
    :model="formData"
    :rules="rules"
    :label-position="labelPosition"
    class="v-form"
  >
    <el-form-item
      v-for="(item, index) in props"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :rules="itemRule(item)"
      :class="{'in-new-line':item.inNewLine}"
    >
      <!-- 普通输入框 -->
      <el-input
        v-if="item.type==='input'||!item.type"
        v-model="formData[item.prop]"
        :type="item.inputType"
        :placeholder="'请输入'+item.label"
        :disable="item.disable?item.disable:false"
        :readonly="item.readonly?item.readonly:false"
        autocomplete="off"
      />
      <!-- 树形选择 -->
      <treeselect
        v-if="item.type==='treeselect'"
        v-model="formData[item.prop]"
        :value="formData[item.prop]"
        :options="item.tree"
        :placeholder="'请选择'+item.label"
        :normalizer="(val)=>treeNormalizer(val,item.treeNormalizer)"
      />
      <!-- 下拉选择 -->
      <el-select
        v-if="item.type==='select'"
        v-model="formData[item.prop]"
        clearable
        :disabled="item.disabled"
        :placeholder="'请选择'+item.label"
      >
        <el-option
          v-for="i in item.options"
          :key="i.value"
          :label="i.label"
          :value="i.value"
          :disabled="i.disabled"
        />
      </el-select>
      <!-- 多选组 -->
      <VCheckGroup
        v-if="item.type==='checkgroup'"
        :options="item.options"
        :name="item.prop"
        @getChecked="setItemValueOfCheck(arguments,item)"
      />
      <!-- 时间选择器 -->
      <el-date-picker
        v-if="item.type==='datepicker'"
        v-model="formData[item.prop]"
        type="date"
        :placeholder="'请选择'+item.label"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import VCheckGroup from '../CheckGroup/CheckGroup';

export default {
  name: 'NormalForm',
  components: {
    Treeselect,
    VCheckGroup
  },
  props: {
    // form 表单的值
    model: {
      type: Object,
      default: ()=>{}
    },
    // form-item配置
    props: {
      type: Array,
      default: ()=>[]
    },
    // 校验规则
    rules: {
      type: Object,
      default: ()=>{}
    },
    // label所在位置，top、left、top
    labelPosition: {
      type: String,
      default: 'top'
    },
    // form表单类名
    formClassName: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      // 表单数据
      formData: {},
    };
  },
  mounted() {
    this.initForm();
  },
  methods: {
    /**
     * @description: 表单初始化
     */    
    initForm() {
      this.formData = Object.assign({},this.model);// 初始化赋值
      this.$refs.form.resetFields();// 初始化时不进行校验
      this.props.forEach((item,index)=> {
        if(item.type === 'select') {
          this.handleSelectFn(item,index);
        }
      });
    },
    /**
     * @description: 处理item的rule默认规则，补充校验提示和触发条件
     * @param {*} item form中的item
     * @return {*} 添加了默认规则的新的rule
     */    
    itemRule(item) {
      item.rules = item.rules || {};
      // 有rule或没rule但required
      if( !_.isEmpty(item.rules) || (_.isEmpty(item.rules) && item.required === true)) {
        // 设置message
        if(!item.rules.message) {
          if(!item.type || item.type === 'input')
            item.rules['message'] = '请输入' + item.label;
          else
            item.rules['message'] = '请选择' + item.label;
        }
        // 设置校验触发动作
        if(!item.rules.trigger) {
          if(!item.type || item.type === 'input')
            item.rules['trigger'] = 'blur';
          else
            item.rules['trigger'] = 'change';
        }
        item.rules['required'] = true;// 设置required
        return item.rules;
      }
      return null;
    },
    /**
     * @description: 处理下拉选项异步的情况
     * @param {*} item 下拉选项配置
     * @param {*} index 下拉选项所在的下标
     */    
    handleSelectFn(item,index) {
      if(!item.optionsFn)return;
      
      // optionsFn直接返回下拉数组
      if(Array.isArray(item.optionsFn)) {
        this.$set(item, 'options', item.optionsFn);
        return;

      }
      // optionsFn返回一个promise
      else if(typeof item.optionsFn === 'object') {
        (async ()=>{
          await item.optionsFn.then((result)=>{
            this.$set(item, 'options', result);
          });
        })();
        return;

      }
      else{
        console.error('请返回正确的optionsFn类型:' + item.prop);
      }
    },
    /**
     * @description: 获取多选值并绑定到form对应项中
     * @param {*} values VCheckGroup中，多选选中的值
     * @param {*} item form中的item
     */    
    setItemValueOfCheck(values,item) {
      let checkedArr = values[0];
      this.$set(this.formData,item.prop,checkedArr);
    },
    /**
     * @description: 树形格式化处理
     * @param {*} node 自带参数，树节点
     * @param {*} normalizer item格式化规则，形如：{idName:'id',labelName:'label',childrenName:'children'}
     * @return {*} 格式化规则
     */    
    treeNormalizer(node,normalizer) {
      if(!normalizer) {
        // 去掉children=[]的children属性
        if(node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.label,
          children: node.children,
        };
      }
      else{
        if(node[normalizer.childrenName] && !node[normalizer.childrenName].length) {
          delete node[normalizer.childrenName];
        }
        return {
          id: node[normalizer.idName],
          label: node[normalizer.labelName],
          children: node[normalizer.childrenName],
        };
      }
    },
  }
};
</script>
<style lang='less' scoped>
  /* 表单 */
.v-form {
  display: grid;
  justify-content: space-evenly;

  /* grid-template-columns: repeat(2,calc(50% - 10px));//默认两列 */
  grid-gap: 0 20px;

  .el-form-item {
    position: relative;

    &.in-new-line {
      /* 从自动行，第一列开始，合并1行1列，以起到新行的作用 */
      grid-area: auto / 1 / span 1 / auto;
    }

    .el-form-item__label {
      width: 100%;
      padding-right: 0;
      text-align: left;
    }

    .el-form-item__content {
      width: 100%;

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
  }
}
</style>