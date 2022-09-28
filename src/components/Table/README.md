## Table Attributes

| 参数         | 说明                                                         | 类型    | 是否必填 | 可选值 | 默认值               |
| ------------ | ------------------------------------------------------------ | ------- | -------- | ------ | -------------------- |
| loading      | 加载效果                                                     | Boolean | 否       | -      | false                |
| tbList       | 表头配置                                                     | Array   | 是       | -      | -                    |
| tbData       | 表格数据                                                     | Array   | 是       | -      | -                    |
| tbLength     | 表格数据总条数，当tbLength不为0时才会显示页码                | Number  | 否       | -      | 0                    |
| actions      | 表格操作列的操作动作                                         | Array   | 否       | -      | -                    |
| defaultSort  | 默认排序方式                                                 | Object  |          | -      | -                    |
| hasExpand    | 是否内含扩展列，如果设置了 `true`则将显示一个可展开的按钮    | Boolean | 否       | -      | false                |
| hasSelection | 是否有多选框                                                 | Boolean |          | -      | false                |
| hasIndex     | 是否有序号列                                                 | Boolean |          | -      | false                |
| pageRange    | 页码步幅                                                     | Array   | 否       | -      | [10,20, 40, 80, 100] |
| tbHeight     | 表格总的高度，不支持百分比                                   | String  | 否       | -      | -                    |
| rowStyle     | 表格行的行内样式                                             | Object  | 否       | -      | -                    |
| totalBorder  | 是否有表格外框                                               | Boolean | 否       | -      | true                 |
| border       | 是否有竖方向的边框                                           | Boolean | 否       | -      | true                 |
| useDefaultWd | 列宽是否使用默认宽度150px，若使用请务必确保至少有一列宽度为auto | Boolean | 否       | -      | false                |



### tbList Attributes

将作用于Table-column的位置

| 参数      | 说明                                                         | 类型    | 是否必填 | 可选值 | 默认值                                            |
| --------- | ------------------------------------------------------------ | ------- | -------- | ------ | ------------------------------------------------- |
| prop      | 对应列内容的字段名                                           | String  | 是       | -      | -                                                 |
| label     | 对应列内容的标题                                             | String  | 是       | -      | false                                             |
| sortable  | 对应列是否可以排序，暂不支持远程排序                         | Boolean | 否       | -      | false                                             |
| width     | 对应列的宽度                                                 | String  | 否       | -      | 当useDefaultWd为true时，默认值150；否则默认值auto |
| align     | 对齐方式                                                     | String  | 否       | -      | center                                            |
| className | 列的 className                                               | String  | 否       | -      | -                                                 |
| slotName  | 插槽名，定义后请使用**同名**的具名插槽，显示时将在对应列插入内容。表格内可使用多个插槽。 | String  | 否       | -      | -                                                 |
| classMap  | 样式Map，用于处理同列不同样式，依赖具体数据值。键名为数据值名，键值为类名。类名内置['success','danger','warning','primary']，效果为设置字体颜色 | Object  | 否       | -      | -                                                 |



### actions Attributes

| 参数    | 说明                                            | 类型     | 是否必填 | 可选值                                             | 默认值 |
| ------- | ----------------------------------------------- | -------- | -------- | -------------------------------------------------- | ------ |
| type    | 按钮类型                                        | String   | 否       | primary / success / warning / danger / info / text | -      |
| label   | 按钮文字，当按钮为空时请务必设置图标类型        | String   | 否       | -                                                  | -      |
| size    | 按钮大小                                        | String   | 否       | medium / small / mini                              | mini   |
| isPlain | 按钮是否是朴素按钮                              | Boolean  | 否       |                                                    | -      |
| icon    | 图标类名                                        | String   | 否       |                                                    | -      |
| click   | 点击事件，使用时请在外层暂存this指向，参数(row) | Function | 是       | -                                                  | -      |



## Table Events

| 方法名           | 说明               | 参数                    | 返回值 |
| ---------------- | ------------------ | ----------------------- | ------ |
| paginationChange | 页码发生变化时触发 | {pageSize，currentPage} | -      |



## Table Methods

| 方法名           | 说明                   | 参数 | 返回值 |
| ---------------- | ---------------------- | ---- | ------ |
| reSetPagination  | 重置当前页码和每页数量 | -    | -      |
| reSetCurrentPage | 重置当前页             | -    | -      |



## Table Slot

| name      | 说明                                        |
| --------- | ------------------------------------------- |
| tableSlot | 自定义扩展列，将追加在每行后面，参数为{row} |



### Table-column Scoped Slot

| name | 说明                                                         |
| ---- | ------------------------------------------------------------ |
| -    | 动态具名插槽，插槽名请在tbList对应项中指明，插槽内容将显示在对应列中，参数为{row} |



### Table $refs

| ref名      | 说明     |
| ---------- | -------- |
| table      | 表格     |
| pagination | 页码控件 |



#### Table Data

table内的数据，可通过this.$refs['myRefName']获取，使用时在组件处命名ref名

| 参数              | 说明         | 类型  | 初始值 |
| ----------------- | ------------ | ----- | ------ |
| multipleSelection | 多选选中的值 | Array | null   |



## Usage
```
<template>
  <div class="demo-panel">
    <v-table
      ref="my-table"
      :loading="loading"
      :tb-list="thList"
      :tb-data="tbData"
      :tb-length="total"
      :actions="actions"
      :page-range="[10,15]"
      has-expand
      has-selection
      has-index
      use-default-wd
      @pagination-change="handlePaginationChange"
    >
      <!-- 表格内置扩展列 -->
      <div
        slot="tableSlot"
        slot-scope="props"
      >
        <span v-if="!props.row.info">
          暂无更多信息
        </span>
        <v-table
          v-else
          ref="inner-table"
          :tb-list="innerTbList"
          :tb-data="props.row.info"
        />
      </div>
      <!-- 表格列插槽 -->
      <div
        slot="switchScope"
        slot-scope="scope"
      >
        <el-switch
          v-model="scope.row.available"
          @change="changeSwitch"
        />
      </div>
    </v-table>
    <el-button
      type="primary"
      size="mini"
      class="btn"
      @click="getChecked"
    >
      点击获取多选项
    </el-button>
    <ol>
      <b>多选选中项:</b> 
      <li
        v-for="(item, index) in checkArr"
        :key="index"
      >
        {{ item }}
      </li>
    </ol>
    <div>
      <b> 详情:</b>
      <br>
      <span>{{ info }}</span>
    </div>
  </div>
</template>

<script>
import VTable from '@/components/Table';
 
// 表头配置
const thList = [
  {label: 'id',prop: 'id'},
  {label: '名称',width: 'auto',prop: 'name'},
  {label: '在线状态',prop: 'onlineText',classMap: {'在线': 'success','离线': 'danger'}},
  {label: '启用状态',slotName: 'switchScope',prop: 'availableText'}
];
// 表格内置table配置
const innerTbList = [
  {prop: 'id',label: 'id'},
  {prop: 'time',label: '时间'}
];
// 在线状态
const onlineType = [
  {value: 0,label: '离线'},
  {value: 1,label: '在线'}
];
// 列表
const list = [
  {
    id: 1,name: '名称1',online: 1,time: '2022-04-22 10:00:00',available: false,
    info: [
      {id: 11,time: '2022-09-14 20:00'},
      {id: 12,time: '2022-09-14 20:00'},
    ]
  },
  {
    id: 2,name: '名称2',online: 0,time: '2022-04-22 10:00:00',available: true,
    info: [
      {id: 11,time: '2022-09-14 20:00'},
      {id: 12,time: '2022-09-14 20:00'},
    ]
  },
  {
    id: 3,name: '名称3',online: 1,time: '2022-04-22 10:00:00',available: false,
  },
];
// 列表数据
const fakeData = {
  total: 15,
  page: 1,
  pageSize: 10,
  data: list
};

export default {
  name: 'VTableDemo',
  components: {
    VTable 
  },
  data() {
    let _this = this;// 暂存this指向
    return {
      loading: false,// 加载
      total: -1,// 总条数
      thList,// 表头
      innerTbList,// 内置表头
      tbData: [],// 表格数据
      // 表格操作动作
      actions: [{
        type: 'text',
        label: '详情',
        click(row) {
          _this.showDetail(row);
        }
      },{
        type: 'primary',
        icon: 'el-icon-info',
        label: '详情',
        isPlain: true,
        click(row) {
          _this.showDetail(row);
        }
      },{
        type: 'text',
        icon: 'el-icon-info',
        click(row) {
          _this.showDetail(row);
        }
      }],
      checkArr: [],// 多选选中的项目
      info: null,// 详情
    };
  },
  mounted() {
    this.getTbData();
  },
  methods: {
    // 搜索右侧资源列表
    getTbData() {
      this.loading = true;
      // ...Api获取数据
      const res = fakeData;
      this.tbData = _.cloneDeep(res.data);
      this.total = res.total;
      this.tbData.map((item) => {
        item.onlineText = onlineType[item.online].label;
        // this.$set(item.)available
        if(item.decoderInfo) {
          item.decoderInfo.forEach((info)=>{
            this.$set(info,'onlineText',onlineType[info.online]);
          });
        }
        return item;
      });
      this.loading = false;
    },
    /**
     * @description: 显示详情/编辑信息
     * @param {*} row 选中的表格行数据
     * @param {Number} type 操作类型： 0-查看,1-编辑
     */    
    showDetail(row) {
      // ...
      this.info = row;
    },
    // 获取表格多选选中值
    getChecked() {
      const rows = this.$refs['my-table'].multipleSelection;// 获取多选行
      if(!rows) {
        this.$message.warning('未选中项目！');
        return;
      }
      this.checkArr = rows;
      // ... 
    },
    // swith按钮状态发生变化
    changeSwitch() {
      // ...    
    },
    /**
     * @description: 页码发生变化，获取数据
     * @param {Number} pageSize 每页大小
     * @param {Number} currentPage 当前所在页
     */   
    handlePaginationChange(pageSize,currentPage) {
      // ...
      this.getTbData();
    }
  }
};
</script>
<style lang="less" scope>
  .btn{
    margin: 20px 0;
  }
</style>
```