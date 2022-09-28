<template>
  <div class="app-container">
    <div class="line">
      模拟接口：
      <button @click="search()">
        查询
      </button>
    </div>
    <div class="line">
      icon图标:
      <svg-icon
        icon-class="login-code"
        class="el-input__icon input-icon"
      />
    </div>
    <div class="line">
      Element使用
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </div>
    <div class="line">
      <div
        v-for="(item, index) of list"
        :key="index"
        class="item"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      value: true,
      list: [
        {
          name: '测试1',
          value: 1
        },
        {
          name: '测试2',
          value: 2
        }
      ]
    };
  },
  methods: {
    search() {
      this.$http.post('/api/userinfo/1314-sd').then((res) => {
        console.log(res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
 @import '~@/assets/styles/index.less';
</style>
