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
    <!-- 操作按钮 -->
    <div
      v-if="hasOperate"
      class="operate-btns"
    >
      <el-button
        size="mini"
        icon="el-icon-plus"
        type="primary"
        @click="promptMethod(0)"
      />
      <el-button
        size="mini"
        icon="el-icon-edit-outline"
        :disabled="!clicked"
        @click="promptMethod(1)"
      />
      <el-button
        size="mini"
        icon="el-icon-delete"
        type="danger"
        :disabled="!clicked"
        @click="removeTreeNode"
      />
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
        lazy
        :default-expanded-keys="expandedKeyArray()"
        :default-checked-keys="checkedKeys"
        :show-checkbox="hasCheckbox"
        @node-click="clickTreeNode"
      >
        <div
          slot-scope="{ node, data }"
          class="custom-tree-node"
        >
          <template>
            <slot
              name="nodeIconSlot"
              :node="node"
              :data="data"
            />
          </template>
          <span
            class="label"
          >{{ node.label }}
          </span>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
// 此处为前端测试用，假数据
import {treeList,treeList2} from './data.js';

export default {
  name: 'NormalTree',
  components: {},
  props: {
    // 页面树结点属性配置
    defaultProps: {
      type: Object,
      default: ()=> {
        return {
          children: 'children',// 子结点参数名
          label: 'label',// 树结点文本内容
          isLeaf: 'leaf'// 是否是根结点
        };
      }
    },
    // api配置
    apiFnConfig: {
      type: Object,
      default: ()=> {
        return {
          getFn: null,//获取树形方法，类型应为Function
          addFn: null,//添加树形方法，类型应为Function
          editFn: null,//编辑树形方法，类型应为Function
          deleteFn: null,//删除树形方法，类型应为Function
          params: {}
        };
      }
    },
    // 树名，用于对话框title用，默认为分组树
    treeName: {
      type: String,
      default: '分组'
    },
    // 根结点数据，注意：若要设置请务必将每个参数都补全
    parentNode: {
      type: Object,
      default: ()=>{
        return {
          id: -1,
          label: '全部',
          children: [],
          leaf: false
        };
      }
    },
    // 是否有多选功能
    hasCheckbox: {
      type: Boolean,
      default: false
    },
    // 是否有增改删操作按钮
    hasOperate: {
      type: Boolean,
      default: true
    },
    // 默认展开结点
    expandedKeys: {
      type: Array,
      default: ()=>[]
    },
    // 默认选中结点
    checkedKeys: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      filterText: '',// 搜索文本
      loading: false,// 加载状态
      intervalId: null,// 定时器id
      clicked: false,
    };
  },
  methods: {
    /**
     * @description: 树形结点点击
     * @param {*} data @node-expand自带的参数: 对象数据data
     * @param {*} node @node-expand自带的参数: 结点node
     */    
    clickTreeNode(data,node) {
      this.$refs.tree.setCurrentKey(data.id);
      this.$emit('clickTreeNode',data);
      this.clicked = data.id!==this.parentNode.id;
    },
    // 展开结点
    expandedKeyArray() {
      let  result = [this.parentNode.id];
      if(this.expandedKeys.length) {
        result = result.concat(...this.expandedKeys);
      }
      return result;
    },
    // 手动触发根结点懒加载事件，用于刷新树形
    treeQuery() {
      let _node = this.$refs.tree.getNode(this.parentNode.id);
      _node.expanded = false;//关闭展开状态
      _node.loaded = false; // 设置未进行懒加载状态
      _node.expand();// 重新展开结点就会间接重新触发load达到刷新效果
    },
    /**
     * @description: 请求树形数据
     * @param {*} id 父级id
     * @return {*} 返回请求数据
     */    
    getTreeData(id = null) {
      // this.clicked = id!==this.parentNode.id;
      // let value = this.filterText || null;// 搜索的文本内容
      // const param = Object.assign({},{pId: id,value:value},this.apiFnConfig.params);
      // (async ()=>{
      //   const result= await this.apiFnConfig.getFn(param)
      //   .then((res) => {
      //     const data = res.data.data;
      //     if (res.data.code !== 200) {
      //       this.$message.error('请求失败');
      //       return [];
      //     }
      //     if (res.data.code === 200) {
      //       return data;
      //     }  
      //    })
      //   })();
      // 此处为前端测试用
      return treeList;
    },
    /**
     * @description: 懒加载树形数据
     * @param {*} node 父结点
     * @param {*} resolve
     */    
    loadTreeData(node, resolve) {

      if (node.level === 0) { // 第一级树形，最外层
        return resolve([this.parentNode]); // 最外层补充结点
      }

      const hasChild = !!node.data.children;
      if(node.level > 3 || !hasChild) {
        return resolve([]);
      }

      this.intervalId = setTimeout(async() => {
        const pId = node.data.id;
        let newTree = await this.getTreeData(pId);
        return  resolve(newTree); 
      }, 500);

      this.loading = false;
    },
    /**
     * @description:  添加、修改树结点
     * @param {*} type 0为添加，1为修改
     */    
    promptMethod(type = 0,id = null) {
      let data = this.$refs.tree.getCurrentNode();
      const pId = data === null ? -1 : data.id;// 若data为空则为顶级
      let title = type === 0 ? '添加' : '修改';
      let inputValue = type === 0 ? null : data.label;
      this.$prompt('请输入分组名称', title + this.treeName, {
        inputPattern: /^.{3,10}$/,
        inputErrorMessage: '请输入3-10个字符',
        inputValue: inputValue,
        customClass:'v-tree-prompt'
      })
        .then(({ value }) => {
          // const apiNameArr=['addFn','editFn']
          // const apiName=apiNameArr[type];
          // let param = {pid: data ? data.id : null,label: value};
          // this.apiFnConfig[apiName](param) 
          //   .then(async (res)=>{
          // await this.treeQuery(); // 重新加载
          this.$message.success(title+'成功！');
          // });
        }).catch((err) => {
          console.log(err)
          this.$message.info('取消输入');  
        });
    },
    /**
     * @description: 删除树结点
     * @param {*} id 原树结点的key，外部调用需要提供待删除的id
     */    
    removeTreeNode(id = null) {
      let data = null;
      if(!id) {
        data = this.$refs.tree.getNode(id);
      }
      else{
        data = this.$refs.tree.getCurrentNode();
      }
      if(data.id === this.parentNode.id) return;// 根结点不允许修改删除 
      this.$confirm('是否确认删除该' + this.treeName + '，删除后将同步删除' + this.treeName + '内所有资源?', {
        type: 'warning'
      }).then(() => {
        // this.apiFnConfig
        //   .deleteFn(data.id) 
        //   .then(async (res)=>{
        //   await this.treeQuery(); // 重新加载
          this.$message.success('删除成功！');
          // });
      }).catch(() => {
        this.$message.info('取消删除');                
      });
    },
  }
};
</script>

<style lang="less">
/* prompt输入框 */
.v-tree-prompt{
 .el-message-box__content{
    display: flex;
    padding: 10px 24px;
    .el-message-box__container{
      padding-top: 15px;
      margin-right: 15px;
    }
    .el-message-box__input{
      flex: 1;
    }
  }
}
</style>

<style lang='less' scoped>
@color-white: #FFF;
@color-primary: #007cee;
@color-primary-focus: lighten(multiply(@color-white, @color-primary), 46%);

.tree-container {
  width: 100%;
  margin: 0;

  .search,
  .operate-btns {
    margin-bottom: 10px;

    /deep/.el-button {
      padding: 4px 6px;
      font-size: 16px;
    }
  }

  .tree {
    overflow: auto;

    /deep/.el-tree {
      height: 100%;
      width: 100%;
      overflow: auto;

      >.el-tree-node {
        display: inline-block;
        min-width: 100%;
      }

      .el-tree-node {
        .el-tree-node__content {
          height: 35px;
          padding: 16px 0;
        }

        &:focus,
        &.is-current {
          >.el-tree-node__content {
            background: @color-primary-focus;
          }
        }
      }
    }
  }

  /* 树结点插槽内的内容，主要用于处理带图标的树结点样式 */
  .custom-tree-node {
    width: 100%;

    .label {
      display: inline-block;
      min-width: 50%;
    }

    /deep/.tree-icon {
      display: inline-block;
      margin-right: 4px;
    }
  }
}
</style>