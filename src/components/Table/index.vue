<template>
  <div
    :style="{'height':tbTotalMaxHeight?tbTotalMaxHeight:`calc(${tbHeight?tbHeight:tbMaxHeight} + 46px)`}"
    :class="['table-container',{'table-container-border':totalBorder}]"
  >
  <div class="table-panel">
    <el-table
      ref="table"
      size="small"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中"
      :data="tbData"
      :stripe="stripe"
      :border="border"
      :row-key="rowKey"
      :current-row-key="currentRowKey"
      :highlight-current-row="highlight"
      :row-class-name="`tb-row ${rowClass}`"
      :default-sort="defaultSort"
      header-row-class-name="tableHeader"
      :height="tbHeight"
      :max-height="tbMaxHeight"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!-- 扩展部分 -->
      <!-- <el-table-column
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
      </el-table-column> -->
        <!-- 常规表格列 -->
      <el-table-column
       v-if="hasRadio"
        width="50"
        class-name="radio-select"
        label="选择"
      >
        <template slot-scope="scope">
          <span @click.stop>
          <el-radio 
          :value="tbRadioValue" 
          :label="rowKey?scope.row[rowKey]:scope.$index" 
          @input.native.stop="radioChange(scope.row,scope.$index,rowKey)"
          />
          </span>
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
        v-for="(item,index) in column"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable?item.sortable:false"
        :width="setWidth(item.width)"
        :align="item.align?item.align:'center'"
        :class-name="item.className"
      >
        <template slot-scope="scope">
          <span @click.stop  v-if="scope.row && item.slot">
          <slot
            :name="item.slot"
            :row="scope.row"
          />
          </span>
           <span
            v-else-if="item.type === 'fn' || item.fn"
            :class="item.classFn && item.classFn(scope.row)"
          >
            {{ item.fn(scope.row) }}
          </span>
          <div
            v-else
            :class="item.classFn && item.classFn(scope.row)"
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
        :fixed="operaFixed"
        :width="actions.length>2?60*actions.length:'150px'"
      >
        <template slot-scope="scope">
          <template v-for="(action,index) in actions">
            <el-button
            :key="index"
            v-if="!(action.hiddenFn&&action.hiddenFn(scope.row))"
            :type="action.type?action.type:'text'"
            :size="action.size?action.size:'mini'"
            :plain="action.isPlain"
            :icon="action.icon"
            :class="[action.class,{'onlyIcon':!action.label}]"
            @click.native.stop="handleBtn(action.click, scope )"
          >
            {{ action.label }}
          </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 页码 -->
    <template v-if="!hidePaginationWhenZero||hidePaginationWhenZero&&total">
      <el-pagination
      ref="pagination"
      :background="paginationBg"
      class="pagination"
      :current-page="pageInfo.current"
      :page-size="pageInfo.size"
      :page-sizes="pageRange"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </template>
  </div>
</template>

<script>
export default {
  name: 'VTable',
  props: {
    // 加载效果
    loading: {
      type: Boolean,
      default: false
    },
    // 表头配置
    column: { 
      type: Array,
      default: () =>[] 
    },
    // 表格数据
    tbData: {
      type: Array,
      default: () =>null 
    },
    // 操作动作
    actions: { 
      type: Array,
      default: () =>[] 
    },
    multipleSelection: { 
      type: Array,
      default: () =>[] 
    },
    // 默认排序方式
    defaultSort: Object,
    // 是否有多选框
    hasSelection: {
      type: Boolean,
      default: false
    }, 
    // 是否有单选框
    hasRadio:{
      type: Boolean,
      default: false
    },
    // 点击表格行时触发单选，需要设置行唯一标识rowKey
    radioByRowClick:{
      type: Boolean,
      default: false
    },
    // 是否有序号列
    hasIndex: {
      type: Boolean,
      default: true
    },
    // 页码步幅
    pageRange: {
      type: Array,
      default: ()=> [10,20, 40, 80, 100]
    },
    // 表格的高度(不包括分页栏)
    tbHeight: [String , Number],
    // 表格的最大高度（不包括分页栏）,合法的值为数字或者单位为 px 的高度。
    tbMaxHeight: [String , Number],
    // 表格的最大高度（包括分页栏）,合法的值为数字或者单位为 px 的高度。
    tbTotalMaxHeight:{
      type:[String , Number],
      default:'100%'
    },
     // 行样式
    rowClass: {
      type: String,
      default: ''
    },
    // 是否有斑马纹
    stripe: {
      type: Boolean,
      default: true
    },
    // 表格外框
    totalBorder: {
      type: Boolean,
      default: false
    },
    // 是否有竖方向的边框
    border: {
      type: Boolean,
      default: true
    },
    // 高亮当前行
    highlight:{
      type: Boolean,
      default: true
    },
    operaFixed:{
      type: String,
      default: 'right'
    },
    // 列宽是否使用默认宽度150px，若使用请务必确保至少有一列宽度为auto
    useDefaultWd: {
      type: Boolean,
      default: false
    },
    // 行key
    rowKey:{
      type:[Function,String],
      default:null
    },
    // 当前行的 key，只写属性
    currentRowKey:{
      type: [String,Number],
      default: null
    },
    // 单选选中行的key值
    currentRowKeyValue:{
       type:[Number,String],
      default:null
    },
    // 页码是否带背景色
    paginationBg:{
      type: Boolean,
      default: true
    },
     // 表格数据的总条数
    total: {
      type: Number,
      default: 0
    },
    // 是否页码总数为0隐藏
    hidePaginationWhenZero: {
      type: Boolean,
      default: true
    },
    // 页码信息
    pageInfo: {
      type: Object,
      default() {
        return {
          current: 1,
          size: 10,
        };
      },
    },
  },
  data() {
    return {
      tbRadioValue:null,//单选选中的值
    };
  },
  mounted(){
    if(this.hasRadio&&this.currentRowKeyValue){
      this.tbRadioValue=this.currentRowKeyValue;
    }
  },
  methods: {
    // 多选变化，传递选中行的数据
    handleSelectionChange(val) {
      this.$emit('update:multipleSelection', val);
      this.$emit('selectChange', val);
    },
    // 行点击时触发
    handleRowClick(row, column, event) {
      if(this.radioByRowClick&&this.rowKey){
        this.radioChange(row,null,this.rowKey);
      }
      this.$emit('row-click',row, column, event);
    },
    radioChange(row,index,rowKey){
      if(rowKey)  this.tbRadioValue=row[rowKey];
      else this.tbRadioValue=index;
      this.$emit('update:currentRowKeyValue', this.tbRadioValue);
      this.$emit('radio-click',{value:this.tbRadioValue,row:row,index:index});
    },
    // 清空单选
    clearRadio(){
      this.tbRadioValue=null;
    },
    // 表格序号列
    tableIndex(index) {
      return (this.pageInfo.current - 1) * this.pageInfo.size + index + 1;
    },
    // 设置默认宽度
    setWidth(width) {
      if(width) return width;        

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
      this.size = this.pageRange[0];
    },
    // 重置搜索时，当前页为1
    reSetCurrentPage() {
      this.currentPage = 1;
    },
    // 处理每页数量变化
    handleSizeChange(val) {
      let pageInfo = {
        current: 1,
        size: val,
      };
      this.$emit('update:pageInfo', pageInfo);
      this.$emit('page-change', pageInfo);
    },
    // 处理当前页变化
    handleCurrentChange(val) {
      let pageInfo = {
        current: val,
        size: this.pageInfo.size,
      };
      this.$emit('update:pageInfo', pageInfo);
      this.$emit('page-change', pageInfo);
    },
    clearSelection(){
      this.$refs.table.clearSelection();
    }
  }
};
</script>

<style lang="less" scoped>
  @tb-border: 1px solid #dedede;

  .table-container {
    &-border {
      border: @tb-border;
    }

    position: relative;

    .table-panel {
      height: calc(100% - 46px);
    }

    .el-table {
      width: 100%;
      // height: 100%;
      // height: calc(100% - 42px);
    }

    /deep/.radio-select {
      text-align: center;

      .cell .el-radio {
        .el-radio__inner {
          box-shadow: none;
        }

        .el-radio__label {
          display: none;
        }
      }
    }

    /deep/.tableHeader th {
      background-color: #f5f5f5;

      /* 避免表头标题被外部样式设置的颜色污染 */
      .cell {
        color: #373838;
      }
    }

    /* 表格内扩展单元 */
    /deep/.el-table__expanded-cell {
      padding: 12px 0;
    }

    // /deep/ tbody tr:hover > td {
    //   background-color: #f8e2ae !important;
    // }

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
      border: none;
      text-align: center;
      line-height: 1;
      padding-top: 4px;
    }

    &-border .pagination {
      border: @tb-border;
      border-top: none;
    }
  }
</style>