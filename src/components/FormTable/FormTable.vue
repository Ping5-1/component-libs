<!--
 * @objectDescription: 表单形表格
 * @LastEditors: wyp
 * @LastEditTime: 2023-02-28 11:00:59
 * @FilePath: \component-libs\src\components\FormTable\FormTable.vue
-->
<template>
  <table
    class="form-table td-center readOnly"
    :class="{'is-striped':isStriped}"
  >
    <colgroup>
      <col
        v-for="(it, i) in cols"
        :key="'cols'+i"
        :class="{'hidden':setColDisplay(it,i)}"
        :style="{width:it.width?it.width:''}"
      >
    </colgroup>
    <thead>
      <tr>
        <th
          v-for="(it, i) in cols"
          :key="'header'+i"
          align="center"
          :class="{'hidden':setColDisplay(it,i)}"
        >
          <td>
            {{ it.label }}
          </td>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-if="datas.length===0"
        class="tr-empty"
      >
        <td
          class="tr-empty-panel"
          :colspan="cols.length"
        >
          {{ emptyText }}
          <slot name="formtable-empty" />
        </td>
      </tr>
      <template v-else>
        <tr
          v-for="(item, index) in datas"
          :key="index"
        >
          <td
            v-for="(it, i) in cols"
            :key="i"
            :class="{'opera-td':!it.prop,'hidden':setColDisplay(it,i)}"
          >
            <div class="form-table-cell">
              <el-input
                v-if="it.prop"
                :key="i"
                v-model="item[it.prop]"
                :maxlength="it.maxlength"
                :show-word-limit="it.wordCount"
                :readonly="readonlyArr[index]"
                :class="{'is-error':errorArr[index*colsLength+i]}"
                @blur="handleInputTrim(item[it.prop],index,it.prop);validate(item[it.prop],it.validateReg,index,i);required(item[it.prop],it.required,index,i);"
              />
              <!-- 操作列 -->
              <!-- v-else-if="showOperaCol" -->
              <template v-else>
                <slot
                  name="opera"
                  :scope="{item,index}"
                />
                <div
                  v-if="readonlyArr[index]"
                  class="opera-box"
                >
                  <el-button
                    type="primary"
                    plain
                    @click="editRow(item,index)"
                  >
                    编辑
                  </el-button>
                </div>
                <div
                  v-else
                  class="opera-box"
                >
                  <el-button
                    type="primary"
                    plain
                    @click="save(item,index)"
                  >
                    保存
                  </el-button>
                </div>
                <div
                  v-if="readonlyArr[index]"
                  class="opera-box"
                >
                  <el-button
                    type="text"
                    class="text-danger"
                    @click="deleRow(item,index)"
                  >
                    删除
                  </el-button>
                </div>
                <div
                  v-else
                  class="opera-box"
                >
                  <el-button
                    type="text"
                    class="text-danger"
                    @click="cancel(item,index)"
                  >
                    取消
                  </el-button>
                </div>
              </template>
              <slot :scope="{item,index}" />
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'FormTable',
  model: {
    prop: 'datas',
    event: 'newData'
  },
  props: {
    // 表格列配置
    cols: {
      type: Array,
      default: ()=>[],
      require: true,
    },
    // 表格数据
    datas: {
      type: Array,
      default: ()=>[],
      require: true,
    },
    // 空文本
    emptyText: {
      type: String,
      default: ()=>'暂无数据',
    },
    // 全部只读
    allReadonly: {
      type: Boolean,
      default: true
    },
    // 斑马条纹
    isStriped: {
      type: Boolean,
      default: false
    },
    // 是否显示操作列
    showOperaCol: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 只读状态列表，以行为单元
      readonlyArr: [],
      // 校验出错列表，一维数组，以表单项为单元
      errorArr: [],
    };
  },
  computed: {
    colsLength() {
      return this.cols.length - 1;// 最后一列是操作列
    }
  },
  watch: {
    allReadonly: {
      immediate: true,
      handler(val) {
        this.readonlyArr = Array(this.datas.length).fill(val ? 'readonly' : false);
      },
    },
  },
  mounted() {
    this.initForm(); 
  },
  methods: {
    // 初始化: 全部只读，全部校验通过
    initForm() {
      this.readonlyArr = Array(this.datas.length).fill('readonly');
      this.errorArr = Array(this.datas.length * this.colsLength).fill(false);
    },
    // 编辑
    editRow(item,index) {
      // 设置编辑状态
      this.$set(this.readonlyArr,index,false);
      this.$emit('edit',item,index);
    },
    // 保存
    save(item,index) {
      let flag = this.validateLine(index);
      if(!flag) return;
      // 恢复只读状态
      this.$set(this.readonlyArr,index,'readonly');
      this.$emit('save',item,index);
    },
    // 取消
    cancel(item,index) {
      let flag = this.validateLine(index);
      if(flag) {
        // 恢复只读状态
        this.$set(this.readonlyArr,index,'readonly');
      }
      this.$emit('cancel',item,index);
    },
    // 删除行
    deleRow(item,index) {
      this.$emit('delete',item,index);
    },
    // 父组件删除行，需要移除更新required和error信息
    handleAfterOutDelete(lineIndex) {
      if(lineIndex === undefined) return console.error('请指明删除行所在下标');

      this.readonlyArr.splice(lineIndex,1);
      const startIndex = lineIndex * this.colsLength;
      this.errorArr.splice(startIndex,this.colsLength);
    },
    // 校验输入
    validate(value,validateReg,lineIndex,colIndex) {
      if(!this.cols || validateReg === undefined || validateReg instanceof RegExp === false) return;

      let flag = validateReg.test(value);
      let index = lineIndex * this.colsLength + colIndex;
      this.$set(this.errorArr,index,!flag);
    },
    // 处理输入框的首尾空格
    handleInputTrim(value,index,prop) {
      if(!value) return;
      
      this.$set(this.datas[index],prop,value.replace(/^\s+|\s+$/gm, ''));
    },
    // 处理非空
    required(value,required,lineIndex,colIndex) {
      if(!this.cols || !required) return;

      let flag = !value && required;
      let index = lineIndex * this.colsLength + colIndex;
      this.$set(this.errorArr,index,flag);
    },
    // 判断是否整行有误
    isLineError(index) {
      let errorList = this.errorArr.slice(index * this.colsLength - 1,index * this.colsLength + this.colsLength);
      let flag = errorList.includes(true);
      return flag;
    },
    // 设置整行校验错误
    setLineError(index,isError = true) {
      for(let i = 0;i < this.colsLength;i++) {
        let errIndex = index * this.colsLength + i;
        this.$set(this.errorArr,errIndex,isError);
      }
    },
    /**
     * @description: 校验整行数据，并设置校验效果
     * @param {*} index 数据行所在下标
     * @return {*} true校验成功，false校验失败
     */    
    validateLine(index) {
      let item = this.datas[index];// 整行的数据
      // 新增数据导致当前行没有校验信息
      if(this.datas.length * this.colsLength > this.errorArr.length) {
        let newError = Array(this.colsLength).fill(false);
        this.errorArr.push(...newError);
      }
      this.cols.forEach((config,colIndex) => {
        let prop = config['prop'] || null;
        let validateReg = config['validateReg'] || null;
        let required = config['required'] || null;
        if(prop) {
          this.validate(item[prop],validateReg,index,colIndex);
          this.required(item[prop],required,index,colIndex);
        }
      });
      let flag = this.isLineError(index);
      return !flag;
    },
    // 控制操作列的显隐
    setColDisplay(it,i) {
      return i === this.colsLength && !this.showOperaCol;
    }
  }
};
</script>

<style lang='less' scoped>
  @import './FormTable.less';
</style>
