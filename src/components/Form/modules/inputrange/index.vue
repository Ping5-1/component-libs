<!--
 * @objectDescription: 范围输入框
 * @LastEditors: wyp
 * @LastEditTime: 2022-12-13 14:57:55
-->
<template>
  <div
    v-clickoutside="handleClose"
    class="input-range"
    :style="{width:width}"
    :class="{'is-active':focus}"
    @click="handleFocus"
  >
    <!-- hidefocus="true" -->
    <el-input
      key="first"
      v-model="value[0]"
      :type="type"
      :disabled="disable"
      class="input-range-item"
      :maxlength="maxlength"
      @blur="limitInput(0)"
    />
    <span class="separator-text">至</span>
    <el-input
      key="second"
      v-model="value[1]"
      :type="type"
      :disabled="disable"
      class="input-range-item"
      :maxlength="maxlength"
      @blur="limitInput(1)"
    />
  </div>
</template>

<script>
import Clickoutside from './clickoutside';
export default {
  name: 'InputRange',
  directives: { Clickoutside },
  model: {
    prop: 'model',
    event: 'newModel'
  },
  props: {
    // 绑定的值
    model: {
      type: Array,
      default: ()=>[]
    },
    // 宽度
    width: {
      type: String,
      default: ()=>'180px'
    },
    maxlength: {
      type: Number,
      default: ()=>null
    },
    // 是否禁用
    disable: {
      type: Boolean,
      default: ()=>false
    },
    type: {
      type: String,
      default: ()=>'text'
    },
    limitReg: {
      type: RegExp ,
      default: ()=>null
    }
  },
  data() {
    return {
      value: ['',''],
      focus: false
    };
  },
  watch: {
    value: {
      handler(val) { 
        this.$emit('newModel', val);
      },
      deep: true
    },
    model: {
      handler(val) { 
        this.value = val;
      },
      deep: true
    }
  },
  mounted() {
    if(this.model && this.model.length === 2) {
      this.$set(this.value,0,this.model[0]);
      this.$set(this.value,1,this.model[1]);
    }
  },
  methods: {
    handleFocus() {
      if(!this.focus) {
        this.focus = true;
        this.$emit('focus', this);
      }
    },
    handleClose() {
      if (!this.focus) return;
      this.focus = false;
      this.$emit('move', this);
    },
    limitInput(index) {
      if(!this.limitReg) return;
      if(index === 0) {
        // console.log(this.limitReg.test(this.value[0]));
        this.value[0] = this.value[0].replace(this.limitReg, '');
        return;
      }
      this.value[1] = this.value[1].replace(this.limitReg, '');
    }
  }
};
</script>

<style lang='less' scoped>
  @height:30px;

  .input-range {
    display: grid;
    grid-template-columns: auto 30px auto;
    background-color: @input-bg;
    border: 1px solid @input-border-color;
    border-radius: 4px;
    color: @font-default;
    font-size: 14px;
    height: @height;//字体大小16px + 上下总共11px + boder
    align-items: stretch;
    justify-items: stretch;
    justify-content: center;
    outline: none;

    &:hover {
      color: @font-default;
      border-color: @input-border-color;
    }

    &.is-active {
      border-color: @input-border-focus;
    }

    &::-webkit-input-placeholder {
      color: @input-placeholder-color;
    }

    .separator-text {
      text-align: center;
      color: @font-default;
      vertical-align: middle;
      line-height: @height;
      min-width: 2em;
    }

    /deep/.input-range-item {
      line-height: @height;
      height: @height;

      .el-input__inner {
        line-height: @height;
        border: none;
        background: transparent;
      }
    }
  }
</style>