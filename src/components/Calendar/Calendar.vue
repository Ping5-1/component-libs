<!--
 * @Author: ypW
 * @objectDescription: 视频资源管理
 * @Date: 2022-09-13 16:33:10
 * @LastEditors: ypw 110900470+Ping5-1@users.noreply.github.com
 * @LastEditTime: 2022-09-21 14:29:03
 * @FilePath: \system-video\src\views\components\Calendar\Calendar.vue
 * @Version: 1.0.0
-->
<template>
  <el-calendar
    v-model="calendarValue"
    class="v-calendar"
  >
    <!-- :class=" { selected : isSelected(date, data) }" -->
    <div
      slot="dateCell"
      slot-scope="{date, data}"
      class="day-cell"
      @click="pickDate(date, data)"
    >
      <div class="solar">
        {{ data.day.split('-')[2] }}
      </div>
      <div class="lunar">
        <span
          v-for="(item,index) in solarToLunar(date, data)"
          :key="index"
          class="lunar-span"
        > {{ item }}</span>
      </div>
    </div>
  </el-calendar>
</template>

<script>
import calendar from './calendarFn.js';// 农历日历

export default {
  name: 'Calendar',
  data() {
    return {
      calendarValue: new Date(),// 日历值，组件必须
      pickDay: ''// 点击选中的日期
    };
  },
  methods: {
    /**
     * @description: 点击具体日期时，传值
     * @param {*} slotDate slot日期 eg,Thu Sep 08 2022 08:00:00 GMT+0800 (中国标准时间)
     * @param {*} slotData slot数据，包含isSelected(是否选中),type(日期所属月份，上个月或下个月，用于处理切换月份),day(具体日期，yyyy-mm-dd格式)
     */    
    pickDate(slotDate, slotData) {
      this.pickDay = slotData.day;
      this.$emit('pickDay',slotData.day);
    },
    // 是否节假日
    getFestival(lunarDay,slotDate, slotData) {
      let festAndTerm = [];
      if(lunarDay.festival) {// 阳历节日
        festAndTerm.push(lunarDay.festival);
      }
      if(lunarDay.lunarFestival) {// 农历节日
        festAndTerm.push(lunarDay.lunarFestival);
      }
      if(lunarDay.Term) {// 节气
        festAndTerm.push(lunarDay.Term);
      }
      return festAndTerm;
    },
    // 公历转农历
    solarToLunar(slotDate, slotData) {
      let solarDayArr = slotData.day.split('-');
      let lunarDay = calendar.solar2lunar(solarDayArr[0], solarDayArr[1], solarDayArr[2]);
      let lunarMD = lunarDay.IDayCn;// 农历日期
      let festAndTerm = this.getFestival(lunarDay,slotDate,slotData);// 特殊日
      return festAndTerm.length ? festAndTerm : [lunarMD];
    }
  }
};
</script>

<style lang='less' scoped>
@color-primary: #007cee;
@color-dark: #001529;
@color-border-lighter:#ebeef5;
@table-border: 1px solid @color-border-lighter;

.v-calendar {
  /* 表格上方 */
  /deep/.el-calendar__header {
    border: unset;

    .el-calendar__title {
      color: @color-primary;
      font-size: 18px;
    }
  }

  /* 表格容器 */
  /deep/.el-calendar__body {
    padding: 8px;
  }

  /* 日历表格 */
  /deep/.el-calendar-table {
    color: @color-dark;

    .el-calendar-day {
      height: 42px;

      /* slot 天 */
      .day-cell {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;

        /* 阳历日期 */
        .solar {
          margin-right: 4px;
        }

        .lunar-span {
          display: block;
        }
      }
    }

    /* 单元格 */
    td {
      text-align: center;
    }

    /* 星期 */
    thead {
      border-color: inherit;

      th {
        padding: 8px 0;
        border-top: @table-border;
        border-right: @table-border;

        &:first-child td {
          border-top: @table-border;
        }

        &:first-child {
          border-left: @table-border;
        }
      }
    }

    /* 当天 */
    .is-today {
      /* background-color: @color-primary; */

      /* color: @color-primary; */

      /* &:hover{
        color: @color-dark;
      } */
    }
  }
}
</style>