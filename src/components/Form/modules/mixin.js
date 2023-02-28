/*
 * @objectDescription: Form通用mixin
 * @LastEditors: wyp
 * @LastEditTime: 2023-02-28 10:53:04
 */
const inputType = ['input','password','textarea','number','autocomplete'];
const isInput = (type)=> !type || inputType.indexOf(type) !== -1;

const selectType = ['select','select-multiple','select-tree','autocomplete'];// treeselect
const isSelect = (type)=> !type || selectType.indexOf(type) !== -1;

const isObj =  (object) =>{// 判断是否是object
  return object && typeof (object) === 'object' && Object.prototype.toString.call(object).toLowerCase() === '[object object]';
};

export default {
  methods: {
    /**
     * @description: 表单值初始化
     * @param {*} model prop传入的表单
     * @param {*} formProps 表单配置
     */
    initFormData(model,formProps) {
      if(!formProps.length) {
        console.error('表单配置不能为空！');
        return;
      }
      let result = {};
      const propKeys = Array.from(formProps,({prop})=>prop);
      propKeys.forEach((key)=>{
        let value = null;
        if(model[key] !== undefined) {
          value = model[key];
        }
        result[key] = value;
      });
      return result;
    },
    /**
     * @description: 处理item的rule默认规则，补充校验提示和触发条件
     * @param {*} item form中的item
     * @return {*} 添加了默认规则的新的rule
     */    
    setItemRule(item) {
      let rules = item.rules;
      // 有rule 或 没rule但required有声明, 注：此处required可能为false
      if( !_.isEmpty(rules) || (_.isEmpty(rules) && item.required !== undefined)) {
        if(!Array.isArray(rules)) 
          return  this.setDefaultRule(item.rules,item.type,item.label,item.required);
        
        // 如果是数组，找到required的规则项，设置对应内容
        rules.forEach((rule)=>{
          if(rule.required !== undefined) {
            rule = this.setDefaultRule(rule,item.type,item.label,item.required);
          }
        });
      }
      return rules;
    },
    /**
     * @description: 初始化设置表单项rule
     * @param {*} rule 原有规则
     * @param {*} type 表单项类型
     * @param {*} label 文本提示
     * @param {*} required 是否
     * @return {*} 补充完基础提示信息及触发动作的校验规则
     */    
    setDefaultRule(rule,type,label,required) {
      if(!rule) {
        rule = {message: null,trigger: null};
      }
      // 设置默认message
      if(!rule.message) {
        // this.$set(rule,'message',(isInput(type) ? '请输入' : '请选择') + label);
        this.$set(rule,'message', label + '不能为空！' );
      }
      // 设置默认校验触发动作
      if(!rule.trigger ) {
        rule['trigger'] = isInput(type) ? 'blur' : 'change';
      }
      if(required !== undefined) rule['required'] = required;// 设置required
      return rule;
    },
    // 添加下拉选项
    addSelectFn(arr) {
      arr.forEach((item,index)=> {
        if(isSelect(item.type) && item.optionsFn) {
          this.handleSelectFn(item);
          this.$set(arr,index,item);
        }
      });
    },
    /**
     * @description: 处理下拉选项异步的情况
     * @param {*} item 下拉选项配置
     */    
    async handleSelectFn(item) {
      if(!item.optionsFn) return;

      // optionsFn直接返回下拉数组
      if(Array.isArray(item.optionsFn)) {
        this.$set(item, 'options', item.optionsFn);
        return;
      }
      
      // optionsFn返回一个promise
      if(item.optionsFn instanceof Promise) {
        (async ()=>{
          await item.optionsFn.then(res=>{
            this.$set(item, 'options', res);
          });
        })();
        return;
      }
      
      // optionsFn返回一个Function
      if(item.optionsFn instanceof Function) {
        console.log(11);
        let param = {};
        if(item.params) {
          if(!isObj(item.params)) return  console.error('参数类型必须是对象:' , item.params);

          param = item.params;
        }
        await item.optionsFn(param).then(res => {
          this.$set(item, 'options', res);
        });
        return;
      }
      
      console.error('请返回正确的optionsFn类型:' + item.prop);
      return;
    },
    /**
     * @description: 根据prop名，获取该表单项在form中的位置
     * @param {*} propName 绑定的prop
     * @return {*} [itemIndex,propIndex] 在表单中的下标，在组合表单项中的下标，默认均为-1
     */    
    getFormItemIndex(propName) {
      let itemIndex = -1;
      let propIndex = -1;
      // let itemKeys = Array.from(this.formProps,({prop})=>prop);
      this.formProps.forEach((item,index)=>{
        if(item.prop && item.prop === propName) {
          itemIndex = index;
        }
        if(item.props) {
          item.props.forEach((it,i)=>{
            if(it.prop && it.prop === propName) {
              itemIndex = index;
              propIndex = i;
            }
          });
        }
      });
      return [itemIndex,propIndex];
    },
    async reQueryItemOptions(item) {
      await this.handleSelectFn(item);

      const [itemIndex,propIndex] = this.getFormItemIndex(item.prop);
      this.$emit('requeryItemOptions',item.prop,itemIndex,propIndex);
    },
    /**
     * * @description: 根据类型，重置对象属性值
     * number -> null, string -> null, boolean -> false, Array -> [], object->null
     * @param {Object} obj 对象
     * @return {Object} obj 重置完值的对象
     */
    resetObjectValue(obj) {
      if(obj === null) {return obj;}
      let resetMap = {'number': null,'string': null,'boolean': false,'array': [],'object': null,'undefined': null};
      for(let key in obj) {
        let type = typeof obj[key];
        // 数据类型不在处理范围内，抛出
        if(!_.hasIn(resetMap, type)) {
          console.error('包含无法处理的数据类型！' + type);
          return null;
        }
        // 处理数组类型
        if(type === 'object' && Array.isArray(obj[key])) {
          type = 'array';
        }
        obj[key] = resetMap[type];
      }
      return obj;
    }
  },
};
