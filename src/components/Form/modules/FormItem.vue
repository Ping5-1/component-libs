<template>
  <div
    class="form-item"
    :class="item.class"
  >
    <!-- 普通输入框 -->
    <el-input
      v-if="item.type==='input'||!item.type"
      v-model="form.formData[item.prop]"
      :type="item.inputType||'text'"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      :disabled="setDisabled(item.disabled)"
      :readonly="item.readonly||false"
      autocomplete="off"
      :maxlength="item.maxlength"
      :show-word-limit="item.wordCount"
      :class="getInputCountClassName(item.maxlength,item.wordCount)"
      @blur="handleInputTrim"
    >
      <!-- 输入框前缀 -->
      <template
        v-if="item.prepend"
        slot="prepend"
      >
        {{ item.prepend }}
      </template>
      <!-- 输入框后缀 -->
      <template
        v-if="item.append"
        slot="append"
      >
        {{ item.append }}
      </template>
    </el-input>
    <!-- 带建议的输入框 -->
    <el-autocomplete
      v-if="item.type==='autocomplete'"
      v-model="form.formData[item.prop]"
      :value-key="item.valueKey||'value'"
      :label="item.valueLabel||'label'"
      :fetch-suggestions="item.fetchSuggestions||handleAutoSuggestions"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      :disabled="setDisabled(item.disabled)"
      :readonly="item.readonly||false"
      :trigger-on-focus="item.triggerOnFocus"
      :maxlength="item.maxlength"
      :show-word-limit="item.wordCount"
      @select="handleAutoSelect"
    />
    <!-- 下拉选择 -->
    <el-select
      v-if="item.type==='select'||item.type === 'select-multiple'"
      v-model="form.formData[item.prop]"
      clearable
      :filterable="item.filterable||false"
      :disabled="setDisabled(item.disabled)"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      :multiple="item.type === 'select-multiple'"
      :collapse-tags="item.type === 'select-multiple'"
      :popper-class="form.isDarkTheme?'dark':'light'"
      @change="handleSelectChange(item)"
    >
      <el-option
        v-for="i in item.options"
        :key="getSelectItemProp(item,i,'key')"
        :label="getSelectItemProp(item,i,'label')"
        :value="getSelectItemProp(item,i,'value')"
        :disabled="setDisabled(i.disabled)"
      />
      <div
        v-if="item.options&&!item.options.length&&item.optionsFn"
        slot="empty"
        class="select-empty"
        @click="handleSelectFn(item)"
      >
        无数据，点击重新加载
      </div>
    </el-select>
    <!-- group-select -->
    <el-select
      v-if="item.type === 'group-select'"
      v-model="form.formData[item.prop]"
      clearable
      :popper-class="form.isDarkTheme?'dark':'light'"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
    >
      <el-option-group
        v-for="group in item.options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="row in group.option"
          :key="row.value"
          :label="row.label"
          :value="row.value"
        />
      </el-option-group>
    </el-select>
    <!-- cascader -->
    <el-cascader
      v-if="item.type === 'cascader'"
      ref="cascader"
      v-model="form.formData[item.prop]"
      :options="item.options"
      :props="setCascaderProps(item.props)"
      :show-all-levels="item.showAllLevel||false"
      clearable
      :popper-class="form.isDarkTheme?'dark':'light'"
      @change="handleCascaderChange"
    />
    <!-- 单选组 -->
    <el-radio-group
      v-if="item.type==='radio'"
      v-model="form.formData[item.prop]"
    >
      <el-radio-button
        v-for="(it, i) in item.options"
        :key="i"
        :label="it.label"
      />
    </el-radio-group>
    <!-- 多选组 -->
    <check-group
      v-if="item.type==='checkgroup'"
      :options="item.options"
      :name="item.prop"
      @getChecked="setItemValueOfCheck(arguments,item)"
    />
    <!-- 日期选择器 -->
    <el-date-picker
      v-if="item.type==='datepicker'"
      v-model="form.formData[item.prop]"
      type="date"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd HH:mm:ss"
      :popper-class="form.isDarkTheme?'dark':'light'"
      :picker-options="handlePickerOptions(item)"
    />
    <!-- 日期时间选择器 -->
    <el-date-picker
      v-if="item.type==='datetime'"
      v-model="form.formData[item.prop]"
      type="datetime"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      :popper-class="form.isDarkTheme?'dark':'light'"
      :picker-options="handlePickerOptions(item)"
    />
    <!-- 日期范围选择器 -->
    <el-date-picker
      v-if="item.type==='daterange'"
      v-model="form.formData[item.prop]"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="daterange"
      range-separator="至"
      start-placeholder="请选择开始日期"
      end-placeholder="请选择结束日期"
      :popper-class="form.isDarkTheme?'dark':'light'"
      :picker-options="handlePickerOptions(item)"
    />
    <!-- 时间范围选择器 -->
    <el-time-picker
      v-if="item.type==='timerange'"
      v-model="form.formData[item.prop]"
      is-range
      range-separator="至"
      start-placeholder="请选择开始时间"
      end-placeholder="请选择结束时间"
      value-format="yyyy-MM-dd HH:mm:ss"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      :popper-class="form.isDarkTheme?'dark':'light'"
      :picker-options="handlePickerOptions(item)"
    />
    <!-- 日期时间范围选择器 -->
    <el-date-picker
      v-if="item.type==='datetimerange'"
      v-model="form.formData[item.prop]"
      type="datetimerange"
      :default-time="['00:00:00', '23:59:59']"
      range-separator="至"
      start-placeholder="请选择开始时间"
      end-placeholder="请选择结束时间"
      value-format="yyyy-MM-dd HH:mm:ss"
      :popper-class="form.isDarkTheme?'dark':'light'"
      :picker-options="handlePickerOptions(item)"
    />
    <!-- textarea -->
    <el-input
      v-if="item.type === 'textarea'"
      v-model="form.formData[item.prop]"
      type="textarea"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      :disabled="setDisabled(item.disabled)"
    />
    <el-input-number
      v-if="item.type === 'number'"
      v-model.number="form.formData[item.prop]"
      type="text"
      :placeholder="setPlaceholder(item.type,item.label,item.placeholder)"
      :disabled="setDisabled(item.disabled)"
      :controls="item.controls||false"
    />
    <!-- switch -->
    <el-switch
      v-if="item.type === 'switch'"
      v-model="form.formData[item.prop]"
      :disabled="setDisabled(item.disabled)"
      :active-value="item.activeValue?item.activeValue:true"
      :inactive-value="item.inactiveValue?item.inactiveValue:false"
    />
    <!-- :active-text="item.activeText ? item.activeText : '是'"
    :inactive-text="item.inactiveText ? item.inactiveText : '否'" -->
    <!-- <template v-if="item.appendSlot">
      <slot :name="item.appendSlot" />
    </template> -->
    <!-- 带提示的输入框 -->
    <div
      v-if="item.tooltip"
      class="form-item-append"
    >
      <el-tooltip popper-class="form-tooltip-info">
        <div
          slot="content"
          v-html="item.tooltip"
        />
        <i class="el-icon-info" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import CheckGroup from './checkgroup';

const inputType = ['input','password','textarea','number'];// 纯输入的formItem类型
const isInput = (type)=> !type || inputType.indexOf(type) !== -1;

const isObj =  (object) =>{// 判断是否是object
  return object && typeof (object) === 'object' && Object.prototype.toString.call(object).toLowerCase() === '[object object]';
};

export default {
  name: 'FormItem',
  components: {
    CheckGroup,
  },
  inject: ['form'],
  props: {
    // 表单单项
    item: {
      type: Object,
      default: ()=>{},
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    strFilter(str) {
      return (optionItem) => {
        let valueName = this.item?.valueKey || 'value';
        return (optionItem[valueName].toLowerCase().indexOf(str.toLowerCase()) === 0);
      };
    },
    // 处理输入框的首尾空格
    handleInputTrim() {
      if(this.form.formData[this.item.prop] === undefined || this.form.formData[this.item.prop] === null) return;

      this.form.formData[this.item.prop] = `${this.form.formData[this.item.prop]}`.replace(/^\s+|\s+$/gm, '');
    },
    getInputCountClassName(length,count) {
      if(!count || length < 10) return;

      if(length < 100) return 'show-word-limit';

      if(length < 1000) return 'show-word-limit-long';

      return 'show-word-limit-huge';
    },
    // 处理输入建议候选项
    async  handleAutoSuggestions(queryString, cb) {
      if(this.item.fetchSuggestions) return;// 传入的优先级更高

      let options = this.item.options || [];
      let results = queryString ? options.filter(this.strFilter(queryString)) : options;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 处理输入建议选中事件
    async handleAutoSelect(selected) {
      // let valueName = this.item?.valueKey || 'value';
      // this.form.formData[this.item.prop] = selected[valueName];
      if(this.item.selectFn) {
        this.item.selectFn(selected);
      }
      // 处理校验
      if(this.form.validateField) {
        this.form.validateField(this.item.prop);
      }
    },
    // 处理下拉框
    handleSelectChange(item) {
      if(!item.changeFn) return;
      
      item.changeFn(this.form.formData[item.prop],item);
    },
    /**
     * @description: 获取多选值并绑定到form.formData对应项中
     * @param {*} values VCheckGroup中，多选选中的值
     * @param {*} item form.formData中的item
     */    
    setItemValueOfCheck(values,item) {
      let checkedArr = values[0];
      this.$set(this.form.formData,item.prop,checkedArr);
    },
    // 设置级联的默认配置
    setCascaderProps(props) {
      if(props) return props;

      return {
        value: 'id',
        label: 'label',
        checkStrictly: true
      };
    },
    // 处理下拉选择配置
    getSelectItemProp(item,i,name) {
      if(!item.selectProps) {
        if(name === 'label' && i[name] === undefined ) return i.dictValue;
        if(name === 'value' && i[name] === undefined) return i.dictKey;
        if(name === 'key' && i[name] === undefined) {
          return i.value || i.dictKey;
        } 
        else return i[name];
      }
      return  i[item.selectProps[name]];
    },
    /**
     * @description: 处理下拉选项异步的情况
     * @param {*} item 下拉选项配置
     */    
    handleSelectFn(item) {
      this.$emit('item-options',item);
    },
    handlePickerOptions(item) {
      if(!item.pickerOptions) return;
      return item.pickerOptions;
    },
    // 处理树形点击
    handNodeClick(currentData, name) {
      this.$set(this.form.formData,name,currentData);
    },
    // 设置级联选中关闭
    handleCascaderChange() {
      this.$refs.cascader.dropDownVisible = false;
    },
    // 设置禁用
    setDisabled(itemDisable) {
      if(itemDisable !== undefined) return itemDisable;

      return false;
    },
    // 设置默认输入提示
    setPlaceholder(type,label,placeholder) {
      if(placeholder !== undefined) return placeholder;

      if(this.form.formReadonly || this.form.noPlaceHolder) {
        return '';
      }

      return (isInput(type) ? '请输入' : '请选择') + label;
    },
  }
};
</script>
<style lang="less">
 .form-tooltip-info {
   line-height: 1.5em;
 }
</style>
<style lang="less" scoped>
  @import '../Form.less';
</style>