<template>
  <div
    ref="select-tree"
    class="select-tree"
  >
    <el-popover
      ref="popover"
      :width="popoverWidth"
      placement="bottom"
      trigger="click"
      :popper-class="`${popperClass} select-tree-popper`"
      class="el-select"
      :disabled="disabled"
      @show="isFocus=true"
      @hide="isFocus=false"
    >
      <el-tree
        ref="tree"
        class="select-tree-list"
        :data="treeData"
        :show-checkbox="multiple"
        :node-key="treeKey"
        :load="loadNode"
        :lazy="lazy"
        highlight-current
        :props="{
          label: 'label',
          children: 'children',
          ...treeProps
        }"
        :default-expand-all="expandAll"
        @check="handleCheckChange"
        @current-change="handleClickChange"
      />
      <template v-if="!treeData.length">
        <slot name="select-tree-empty" />
      </template>
      <template #reference>
        <el-input
          v-if="!multiple"
          v-model="inputText"
          :value="inputText"
          type="text"
          readonly
          :placeholder="placeholder"
          :disabled="disabled"
          :suffix-icon="isFocus?'el-icon-arrow-up':'el-icon-arrow-down'"
        />
        <div
          v-else
          :class="`el-input el-input--${size}`"
        >
          <div class="el-input__inner el-input--suffix">
            <span
              v-if="!value || !value.length"
              class="placeholder"
            >
              {{ placeholder }}
            </span>
            <div
              v-for="item in checkList"
              :key="item[treeKey]"
              class="tag el-tag el-tag--info el-tag--small el-tag--light"
            >
              <span class="el-select__tags-text">{{ item[labelKey] }}</span>
              <i
                class="el-tag__close el-icon-close"
                @click.stop="handleRemove(item[treeKey])"
              />
            </div>
          </div>
          <span class="el-input__suffix">
            <span class="el-input__suffix-inner">
              <i
                class="el-input__icon el-select__caret el-icon-arrow-up"
                :class="{'is-reverse':isFocus}"
              />
            </span>
          </span>
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  name: 'SelectTree',
  model: {
    prop: 'value',
    event: 'newValue'
  },
  props: {
    value: {
      type: [Array, String, Number],
      default: null
    },
    treeData: {
      type: Array,
      default: ()=>[],
      require: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    treeKey: {
      type: String,
      default: 'id'
    },
    treeProps: {
      type: Object,
      default: null
    },
    onlyLeaf: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    loadNode: {
      type: Function,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: String,
      default: ''
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      checkNode: [],
      selectNode: '',
      checkList: [],
      selectObj: {},
      popoverWidth: '',
      isFocus: false,// 聚焦状态
      inputText: '',// 单选类型的显示文本
    };
  },
  computed: {
    labelKey() {
      return this.treeProps?.label || 'label';
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.handleUpdateValue();
      }
    },
    selectObj: {
      deep: true,
      handler(val) {
        this.inputText = val[this.labelKey];
        if(val[this.treeKey])
          this.$emit('newValue', val[this.treeKey]);
      }
    },
    checkNode: {
      deep: true,
      handler(val) {
        this.$emit('newValue', val);
      }
    }
  },
  mounted() {
    this.handleUpdateValue();
    this.$nextTick(()=>{
      this.popoverWidth = this.$refs['select-tree'].clientWidth ;
    });
  },
  methods: {
    handleRemove(value) {
      this.$refs.tree.setChecked(value, false, true);
      this.handleCheckChange();
    },
    // 多选树形
    handleCheckChange() {
      if (this.onlyLeaf) {
        this.checkList = this.$refs.tree
          ?.getCheckedNodes()
          .filter((i) => i.isLeaf);
        this.checkNode = this.checkList.map((i) => i[this.treeKey]);

      } else {
        this.checkList = this.$refs.tree?.getCheckedNodes();
        this.checkNode = this.checkList.map((i) => i[this.treeKey]);
      }
      this.$emit('input', this.checkNode);
      this.$emit('change', this.checkList);
    },
    // 单选树形点击事件
    handleClickChange() {
      if (this.multiple) return;

      this.selectNode = this.$refs.tree.getCurrentKey();
      let obj = this.$refs.tree.getCurrentNode();
      this.selectObj = Object.assign({},obj);
      this.$emit('input', this.selectNode);
      this.$emit('change', this.selectObj);
      this.$refs['popover'].doClose();
    },
    // 处理数据更新问题
    handleUpdateValue() {
      if (this.multiple) {
        if (!_.isEqual(this.value, this.checkNode)) {
          this.$refs.tree.setCheckedKeys(this.value || []);
          this.handleCheckChange();
        }
      } else {
        if (_.isEqual(this.value, this.selectObj[this.treeKey])) return;

        // 传入的key为空并且当前选中对象无对应数据，则可能是初始化，返回
        if((this.value === null || this.value === undefined) && !_.has(this.selectObj, [this.treeKey])) {
          return;
        };

        this.$set(this.selectObj,this.treeKey,this.value);
        // 如果外部传入空,则显示空并取消树形选中
        if (!this.value) {
          this.inputText = '';
          this.$refs.tree.setCurrentKey(null);
          return;
        } 
        
        this.$refs.tree.setCurrentKey(this.value);
        this.handleClickChange();
      }
    }
  }
};
</script>
<style lang="less">
  .el-popover.select-tree-popper {
    padding-right: 4px;
    min-width: 200px;

    &.dark .select-tree-list {
      .webkit-scrollbar();
    }

    &.light .select-tree-list {
      .webkit-scrollbar(8px,8px,20px,false);
    }

    .select-tree-list {
      max-height: 352px;
      overflow: auto;

      .el-tree-node {
        // width: fit-content;

        .el-tree-node__content {
          width: 100%;
          height: 34px;//element 下拉选项的高度
        }

        & > .el-tree-node__children {
          overflow: unset;
        }
      }
    }
  }

  @media screen and (max-height: 920px) {
    .el-popover.select-tree-popper .select-tree-list {
      max-height: 240px;
    }
  }

</style>
<style lang="less" scoped>
  .select-tree {
    min-width: 200px;
    height: 40px;
    line-height: 40px;

    .el-select {
      width: inherit;
    }

    .el-input {
      // line-height: calc(30px - 10px);
      height: 40px;
      line-height: 40px;

      .el-input__inner {
        display: inline-block;
        // height: 30px;
        // line-height: calc(30px - 10px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .el-input__suffix {
          height: inherit;
          color: @form-info-color;
        }

        // .el-select__caret{

        // }
        // .is-reverse {
        //   transition: transform 0.3s;
        //   transform: rotateZ(180deg);
        //   // transform: rotateZ(0deg);
        //   // &::before {
        //   //   transform: rotateX(-180deg);
        //   // }
        // }
      }

      // .el-input {
      //   cursor: pointer;
      // }

      .placeholder {
        font-size: 14px;
        color: @input-placeholder-color;
      }

      .tag {
        flex-grow: 0;
        width: fit-content;
        display: inline-flex;
      }

      .tag + .tag {
        margin-left: 10px;
      }
    }
  }

  // .select-tree-tag {
  //   display: grid;
  //   grid-gap: 10px;
  //   grid-template-columns: auto;
  //   grid-auto-flow: row dense;

  //   .tag {
  //     width: fit-content;
  //   }
  // }
</style>