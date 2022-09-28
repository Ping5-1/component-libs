<template>
  <!-- 多选组 -->
  <div
    class="v-checkbox-panel"
    :class="{'inline':isInline}"
  >
    <div
      v-for="(item,index) in options"
      :key="index"
      :class="[{'is-bordered':isBordered}, {'is-checked': isChecked(item) }]"
      class="v-checkbox"
      @click.stop="checkChange(item)"
    >
      <span
        class="v-checkbox-inner"
      />
      <input
        :model="isChecked(item)"
        :checked="isChecked(item)"
        class="v-checkbox-input"
        type="checkbox"
        :value="item.value"
        :name="name"
        :disabled="item.disable?item.disable:false"
        @click.stop="checkChange(item)"
      >
      <span class="v-checkbox-label">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NormalCheckGroup',
  props: {
    // 候选项
    options: {
      type: Array,
      default: ()=>[{value: '',label: '',disabled: false,checked: false}]
    },
    // form中对应的item项
    name: {
      type: String,
      default: ''
    },
    // 是否带边框
    isBordered: {
      type: Boolean,
      default: true
    },
    // 是否横向排布
    isInline: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      value: []// 多选值
    };
  },
  mounted() {
    this.$emit('getChecked',this.value);// 挂载时抛出空值，否则外部找不到变量
  },
  methods: {
    /**
     * @description: 选中状态发生变化，多选值更新
     * @param {*} item 多选项
     */    
    checkChange(item) {
      let index = this.value.indexOf(item.value);
      if(index === -1) {
        this.value.push(item.value);
      }else{
        this.value.splice(index,1);
      }
      this.isChecked(item);
      this.$emit('getChecked',this.value);
    },
    /**
     * @description:  判断是否选中
     * @param {*} item 多选项
     */    
    isChecked(item) {
      return  this.value.indexOf(item.value) !== -1;
    }
  }
};
</script>

<style lang='less' scoped>
@color-primary-check:#409eff;
@color-font:#606266;
@color-check-bg:#fff;
@border-check:1px solid #dcdfe6;
@width-boxcheck:16px;

.v-checkbox-panel {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: column;/* 默认竖向排布 */
}

/* 横向排布 */
.v-checkbox-panel.inline {
  flex-direction: row;
}

/* 总的多选框 */
.v-checkbox {
  display: flex;
  position: relative;
  margin: 6px 20px 6px 0;
  padding: 9px 20px 9px 10px;
  color: @color-font;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  align-self: baseline;/* 自动撑开，而非固定宽度、自动充满 */
}

/* 多选输入框，用于绑定值 */
.v-checkbox-input {
  outline: none;
  display: inline-block;
}
.v-checkbox-input[type="checkbox"] {
  visibility: hidden;
  width: 0;
}

/* 多选方框，显示选中状态 */
.v-checkbox-inner {
  display: inline-block;
  position: relative;
  border: @border-check;
  border-radius: 2px;
  box-sizing: border-box;
  width: @width-boxcheck;
  height: @width-boxcheck;
  background-color: @color-check-bg;
  z-index: 1;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);

  &::after {
    box-sizing: content-box;
    content: "";
    border: 1px solid @color-check-bg;
    border-left: 0;
    border-top: 0;
    width:calc(@width-boxcheck / 4);
    height:calc(@width-boxcheck / 2);
    left:calc(@width-boxcheck / 4);
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    transition: transform 0.15s ease-in 0.05s;
    transform-origin: center;
  }
}

.v-checkbox.is-checked .v-checkbox-inner::after {
  transform: rotate(45deg) scaleY(1);
}

.v-checkbox.is-checked {
  color: @color-primary-check;

  .v-checkbox-inner {
    background-color: @color-primary-check;
    border-color: @color-primary-check;
  }
}

.v-checkbox.is-bordered {
  border-radius: 6px;
  border: @border-check;
  box-sizing: border-box;
  line-height: normal;
  height: 40px;

  &.is-checked {
    border-color: @color-primary-check;
  }
}
</style>