<template>
  <div
    :style="{'height':tbHeight}"
    :class="['table-container',{'table-container-border':totalBorder}]"
  >
    <el-table
      ref="table"
      v-loading="loading"
      size="small"
      :data="tbData"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中"
      :stripe="stripe"
      :border="border"
      highlight-current-row
      :row-style="rowStyle"
      :default-sort="defaultSort"
      header-row-class-name="tableHeader"
      @selection-change="handleSelectionChange"
    >
      <!-- 扩展部分 -->
      <el-table-column
        v-if="hasExpand"
        type="expand"
        width="35"
      >
        <template slot-scope="scope">
          <slot
            name="tableSlot"
            :row="scope.row"
          />
        </template>
      </el-table-column>
      <!-- 如果有多选框 -->
      <el-table-column
        v-if="hasSelection"
        type="selection"
        :align="'center'"
        width="50"
      />
      <!-- 如果有序号列 -->
      <el-table-column
        v-if="hasIndex"
        type="index"
        label="序号"
        :index="tableIndex"
        :align="'center'"
        width="50"
      />
      <!-- 常规表格列 -->
      <el-table-column
        v-for="(item,index) in tbList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable?item.sortable:false"
        :width="setWidth(item.width)"
        :align="item.align?item.align:'center'"
        :class-name="item.className"
      >
        <template slot-scope="scope">
          <slot
            v-if="scope.row && item.slotName"
            :name="item.slotName"
            :row="scope.row"
          />
          <div
            v-if="!item.slotName"
            :class="item.classMap?item.classMap[scope.row[item.prop]]:''"
          >
            {{ scope.row[item.prop] }}
          </div>
        </template>
      </el-table-column>
      <!-- 末尾操作列 -->
      <el-table-column
        v-if="actions.length"
        :align="'center'"
        label="操作"
        :width="actions.length>3?auto:90*actions.length"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(action,index) in actions"
            :key="index"
            :type="action.type"
            :size="action.size?action.size:'mini'"
            :plain="action.isPlain"
            :icon="action.icon"
            :class="{onlyIcon:!action.label}"
            @click="handleBtn(action.click, scope )"
          >
            {{ action.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      v-if="tbLength"
      ref="pagination"
      class="pagination"
      :current-page="currentPage"
      :page-sizes="pageRange"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tbLength"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    // 加载效果
    loading: {
      type: Boolean,
      default: false
    },
    // 表头配置
    tbList: { 
      type: Array,
      default: () =>[] 
    },
    // 表格数据
    tbData: {
      type: Array,
      default: () =>null 
    },
    // 表格数据的总条数
    tbLength: {
      type: Number,
      default: 0
    },
    // 操作动作
    actions: { 
      type: Array,
      default: () =>[] 
    },
    // 默认排序方式
    defaultSort: {
      type: Object,
      default: () =>{}
    }, 
    // 是否有内置扩展
    hasExpand: {
      type: Boolean,
      default: false
    },
    // 是否有多选框
    hasSelection: {
      type: Boolean,
      default: false
    }, 
    // 是否有序号列
    hasIndex: {
      type: Boolean,
      default: false
    },
    // 页码步幅
    pageRange: {
      type: Array,
      default: ()=> [10,20, 40, 80, 100]
    },
    // 表格总的高度，不支持百分比
    tbHeight: {
      type: String,
      default: ''
    },
    // 表格行的行内样式
    rowStyle: {
      type: Object,
      default: ()=>{}
    },
    // 是否有斑马纹
    stripe: {
      type: Boolean,
      default: true
    },
    // 表格外框
    totalBorder: {
      type: Boolean,
      default: true
    },
    // 是否有竖方向的边框
    border: {
      type: Boolean,
      default: true
    },
    // 列宽是否使用默认宽度150px，若使用请务必确保至少有一列宽度为auto
    useDefaultWd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multipleSelection: null,// 多选的值，为row合集
      pageSize: this.pageRange[0],// 默认每页大小
      currentPage: 1// 默认当前页
    };
  },
  methods: {
    // 多选变化，传递选中行的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格序号列
    tableIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 设置默认宽度
    setWidth(width) {
      if(width) {
        return width;        
      }

      if(!this.useDefaultWd) return 'auto';

      return '150';
    },
    /**
     * @description: 点击操作按钮
     * @param {*} action 按钮操作外部方法
     * @param {*} scopeData 当前行信息, 包含 { row, column, $index } 
     * @return {*} 新的操作方法，用于绑定点击事件
     */   
    handleBtn(action,scopeData) {
      // ctx:额外上下文，此处为外部可能用得上的table的data
      const ctx = {
        items: this.data
      };
      let self = this;
      if (typeof action === 'function') {
        // A.call(thisArgs, args1, args2,...): 调用function A，修改this指向为thisArgs，并传递参数args1,args2...
        action.call(self, scopeData.row,scopeData.$index, ctx);
      }
      return action;
    },
    // 重置页码当前页和每页数量
    reSetPagination() {
      this.currentPage = 1;
      this.pageSize = this.pageRange[0];
    },
    // 重置搜索时，当前页为1
    reSetCurrentPage() {
      this.currentPage = 1;
    },
    // 处理每页数量变化
    handleSizeChange(val) {
      this.currentPage = 1;// 每页数量发生变化，当前页应置为首页
      this.pageSize = val;
      this.$emit('pagination-change', this.pageSize,  this.currentPage );
    },
    // 处理当前页变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit('pagination-change', this.pageSize,  val );
    }
  }
};
</script>

<style lang="less" scoped>
@color-primary: #007cee;
@color-success: #13ce66;
@color-warning: #ffba00;
@color-danger: #ff0000;

.table-container {
  &-border{
    border: 1px solid #dedede;
  }
  position: relative;

  .el-table {
    width: 100%;
    height: calc(100% - 42px);
  }

  /deep/.tableHeader th {
    background-color: #f5f5f5;

    /* 避免表头标题被外部样式设置的颜色污染 */
    .cell {
      color: #373838;
    }
  }

  /* 内置字体颜色 */
  /deep/.el-table__row {
    .el-table__cell .cell {
      .success {
        color: @color-success;
      }

      .danger {
        color: @color-danger;
      }

      .warning {
        color: @color-warning;
      }

      .primary {
        color: @color-primary;
      }
    }
  }

  /* 表格内扩展单元 */
  /deep/.el-table__expanded-cell {
    padding: 12px 0;
  }

  /deep/ tbody tr:hover > td {
    background-color: #f8e2ae !important;
  }

  /deep/.el-button {
    /* 纯图标操作按钮时，加大图标 */
    &.onlyIcon {
      padding: 6px;

      i {
        font-size: 16px;
      }
    }
  }
    /* 页码 */
  .pagination {
    width: 100%;
    height: 42px;
    border: 1px solid #dedede;
    border-top: none;
    text-align: center;
    line-height: 1;
    padding-top: 4px;
  }
}
</style>