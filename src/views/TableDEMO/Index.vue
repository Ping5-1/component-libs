<template>
  <div class="demo-panel">
    <div class="box-title-main">
      <router-link
        to="/"
      >
        <i class="el-icon-s-home icon" />
      </router-link>
    </div>
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
  .icon{
    font-size: 20px;
    color: MediumSlateBlue;
  }
</style>