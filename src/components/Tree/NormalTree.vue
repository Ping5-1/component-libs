<template>
  <div
    class="tree-container"
  >
    <div class="search">
      <!-- 带清空按钮的输入框 -->
      <el-input
        v-model="filterText"
        placeholder="请输入关键字"
        clearable
        @clear="treeQuery"
      >
        <!-- 搜索按钮 -->
        <i
          slot="suffix"
          class="el-icon-search el-input__icon"
          @click="treeQuery"
        />
      </el-input>
    </div>
    <div
      v-loading="loading"
      class="tree"
    >
      <el-tree
        ref="tree"
        :load="loadTreeData"
        :props="defaultProps"
        node-key="id"
        :expand-on-click-node="false"
        :data="treeDataShow"
        lazy
      >
        <div
          slot-scope="{ node, data }"
          class="custom-tree-node"
        >
          <span
            class="label"
            @click="clickTreeNode(data)"
          >{{ node.label }}
          </span>
          <!-- 操作按钮 -->
          <span>
            <el-button
              v-if="node.level!==3"
              size="mini"
              icon="el-icon-plus"
              @click="() => promptMethod(data,0)"
            />
            <el-button
              size="mini"
              icon="el-icon-edit-outline"
              @click="() => promptMethod(data,1)"
            />
            <el-button
              size="mini"
              icon="el-icon-delete"
              @click="() => removeTreeNode(node,data)"
            />
          </span>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// 此处为前端测试用，假数据
import {treeList,treeList2} from './data.js';

export default {
  name: 'NormalTree',
  components: {},
  props: {
    // 页面树节点属性配置
    defaultProps: {
      type: Object,
      default: ()=> {
        return {
          children: 'children',// 子节点参数名
          label: 'label',// 树节点文本内容
          isLeaf: 'leaf'// 是否是根节点
        };
      }
    },
    // api配置
    apiConfig: {
      type: Object,
      default: ()=> {
        return {
          apiUrl: '/',
          typeApi: {
            get: '/',
            add: '/',
            edit: '/',
            delete: '/',
          },
          params: {}
        };
      }
    },
    // 树名，用于对话框title用，默认为分组树
    treeName: {
      type: String,
      default: '分组'
    },
  },
  data() {
    return {
      filterText: '',// 搜索文本
      loading: false,// 加载状态
      intervalId: null,// 定时器id
      treeDataShow: [],// 当时不使用懒加载时，el-tree的显示数据
      treeNode: {node: null,resolve: null},// 暂时存放的懒加载根节点
    };
  },
  methods: {
    // 树形节点点击
    clickTreeNode(data) {
      this.$emit('clickTreeNode',data.id);
    },
    // 搜索框搜索树形结构
    treeQuery() {
      const param = {name: this.filterText};
      this.loading = true;
      // 有搜索内容
      this.$refs.tree.$data.store.lazy = !this.filterText;
      if(this.filterText) {
        // ...此处获取数据
        const data = treeList2;
        this.treeDataShow = data;
        this.loading = false;
      }
      // 当搜索框中无数据时，继续走懒加载
      else{
        this.treeDataShow = [];// 清空原来的treeDataShow数据
        this.intervalId = setTimeout(() => {
          this.loadTreeData(this.treeNode.node,this.treeNode.resolve);
        }, 500);
      }
    },
    /**
     * @description: 请求树形数据
     * @param {*} id 父级id
     * @return {*} 返回请求数据
     */    
    getTreeData(id = null) {
      // const api = this.apiConfig.apiUrl + this.apiConfig.typeApi.get;
      // const param = Object.assign({},{pId: id},this.apiConfig.params);
      // // api 请求数据
      // axios
      //   .get(api,param) 
      //   .then((res) => {
      //     this.loading = false;
      //     const data = res.data.data;
      //     if (res.data.code !== 200) {
      //       this.$message.error('请求失败');
      //       return [];
      //     }
      //     if (res.data.code === 200) {
      //       return data;
      //     }  
      //   });
      // 此处为前端测试用
      return treeList;
    },
    /**
     * @description: 懒加载树形数据
     * @param {*} node 父节点
     * @param {*} resolve
     * @return {*}
     */    
    loadTreeData(node, resolve) {
      if (node.level === 0) { // 第一级树形
        this.treeNode.node = node;
        this.treeNode.resolve = resolve;
        return resolve(this.getTreeData());  
      }
      const hasChild = !!node.data.children;
      if(node.level >= 3 || !hasChild) {
        this.loading = false;
        return resolve([]);
      }

      let newData = [];// 懒加载新获取的数据
      this.intervalId = setTimeout(() => {
        const pId = node.data.id;
        return  resolve(this.getTreeData(pId));  
      }, 500);
      
    },
    /**
     * @description: 添加、修改树节点
     * @param {*} data 树节点data
     * @param {*} type 0为添加，1为修改
     */    
    promptMethod(data = null,type = 0) {
      let title = type === 0 ? '添加' : '修改';
      let inputValue = type === 0 ? null : data.label;
      this.$prompt('请输入名称', title + this.treeName, {
        inputPattern: /^.{3,10}$/,
        inputErrorMessage: '请输入3-10个字符',
        inputValue: inputValue
      })
        .then(async ({ value }) => {
          console.log(title + this.treeName + 'pId:' + data + ',value:' + value);
          // vue视图中的动作
          if(type === 1) {// 编辑
            this.$set(data, 'label', value);
          }
          // ... 在此添加修改
          // let typeToApi = {0: 'add',1: 'edit'};
          // let apiName = typeToApi[type];
          // let api = this.apiConfig.apiUrl + this.apiConfig.typeApi[apiName];
          // let param = {pid: data ? data.id : null,label: value};
          // axios
          //   .post(api,param) 
          //   .then(resThenFn)
          //   .then(async ()=>{
          //     await this.loadTreeData(); // 重新加载
          //   });
        }).catch(() => {
          this.$message.info('取消输入');       
        });
    },
    /**
    /**
     * @description: 删除树节点
     * @param {*} node 原树节点node
     * @param {*} data 原树节点data
     * @return {*}
     */    
    removeTreeNode(node,data) {
      this.$confirm('是否确认删除该' + this.treeName + '，删除后将同步删除' + this.treeName + '内所有资源?', {
        type: 'warning'
      }).then(() => {
        // ... 在此删除
        // const api = this.apiConfig.apiUrl + this.apiConfig.typeApi.delete;
        // axios
        //   .delete(api, data.id) 
        //   .then(resThenFn);
        // vue视图中的动作
        const parent = node.parent;
        // 注：在懒加载模式下，children均为长度为0的Array，此处只能通过childNodes找子项
        const children = parent.childNodes;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      }).catch(() => {
        this.$message.info('取消删除');                
      });
    },
    /**
     * @description: 处理请求返回成功与否
     * @param {*} res
     * @return {*}
     */    
    resThenFn(res) {
      if(!res.data.code === 200)return false;

      this.$message.success(res.data.message);
      return true;
    }
  }
};
</script>

<style lang='less' scoped>
@color-primary: #007cee;
@color-primary-focus: lighten(multiply(@color-white, @color-primary), 46%);
@color-danger: #f00;
.tree-container {
  width: 100%;
  margin: 0;

  .search {
    margin: 10px 0;
  }

  .tree {
    height: 90%;
    overflow: auto;

    .el-tree {
      height: 100%;
      width: 100%;
      overflow: auto;

      /deep/.el-tree-node {
        .el-tree-node__content {
          height: 30px;
          padding: 16px 0;
        }
      }
    }

    /deep/.el-tree > .el-tree-node {
      display: inline-block;
      min-width: 100%;
    }
  }

  .el-tree-node__content {
    height: 35px ;
  }

  /deep/.el-tree-node {
    &:focus,
    &.is-current {
      >.el-tree-node__content {
        background: @color-primary-focus;
      }
    }
  }

  // tree-node slot
  .custom-tree-node {
    width: 100%;

    .label {
      display: inline-block;
      min-width: 50%;
    }

    /deep/.el-button {
      padding: 4px;
      font-size: 14px;

      .el-icon-plus,
      .el-icon-edit-outline {
        color: @color-primary;
      }

      .el-icon-delete {
        color: @color-danger;
      }
    }
  }
}
</style>