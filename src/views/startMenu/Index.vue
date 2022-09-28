<template>
  <div class="page-container">
    <div class="box-title-main">
      菜单一览
    </div>
    <ul class="ul-list">
      <ol
        v-for="(item, index) in menuRoutes"
        :key="index"
      >
        <router-link
          v-if="!item.children"
          :to="item.path"
        >
          <div class="item-row">
            {{ item.name }}
          </div>
        </router-link>
        <div v-if="item.children">
          <ul>
            <li
              v-for="subItem in item.children"
              :key="subItem.path"
            >
              <router-link
                :to="item.path + '/' + subItem.path"
              >
                {{ subItem.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </ol>
    </ul>
  </div>
</template>

<script>
import { constantRoutes } from '@/router';
const routerMenu = [{name: 'Table',path: '@/views/Table/Index'}];
export default {
  name: 'StartMenu',
  components: {},
  data() {
    return {
      menuRoutes: constantRoutes
    };
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang='less' scoped>
  .ul-list{
    line-height: 2em;
    font-size: 18px;
    text-indent: 0.5em;
  }
</style>