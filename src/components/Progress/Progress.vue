<template>
  <div>
    <div
      ref="slider"
      class="slider"
      :style="{background:bgColor,borderRadius:borderRadius,height:height,width:sliderWidth}"
    >
      <div
        class="slider-process"
        :style="{width:barwidth ,background:barColor}"
      />
      <div
        v-if="showBarBtn"
        ref="trunk"
        class="thunk"
        :style="{ left }"
      >
        <div class="block" />
      </div>
    </div>
    <div />
    <div v-if="showBtn">
      <button @click="handleIncrease">
        +
      </button>
      {{ percentage }}%
      <button @click="handleDecrease">
        -
      </button>
    </div>
  </div>
</template>

<script>
import { min } from 'lodash';
export default {
  props: {
    // 进度条最小值
    min: {
      type: Number,
      default: 0
    },
    // 进度条最大值
    max: {
      type: Number,
      default: 100
    },
    // 对当前值进行双向绑定实时显示拖拽进度
    value: {
      type: Number,
      default: 0
    },
    // 显示进度加减按钮
    showBtn: {
      type: Boolean,
      default: false
    },
    // 显示进度滑块
    showBarBtn: {
      type: Boolean,
      default: true
    },
    // 进度条颜色
    barColor: {
      type: String,
      default: '#0077DE'
    },
    // 进度条背景颜色
    bgColor: {
      type: String,
      default: '#0df'
    },
    // 进度条圆角
    borderRadius: {
      type: String,
      default: 'none'
    },
    // 进度条宽度
    height: {
      type: String,
      default: '7px'
    },
    // 进度条长度
    sliderWidth: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      slider: null, // 滚动条DOM元素
      thunk: null, // 拖拽DOM元素
      percentage: this.value, // 当前值
    };
  },
  computed: {
  // 设置一个百分比，提供计算slider进度宽度和trunk的left值
  // 对应公式为 当前值-最小值/最大值-最小值 = slider进度width / slider总width
  // trunk left = slider进度width + trunk宽度/2
    scale() {
      return (this.percentage - this.min) / (this.max - this.min);
    },
    barwidth() {
      if(this.showBarBtn && this.slider) {
        return this.slider.offsetWidth * this.scale + 'px';
      } 
      // console.log(this.value);
      return this.value + '%' ;
    },
    left() {
      if (this.slider) {
        const result = this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2 + 'px';
        return result;
      } else {
        return 0 ;
      }
    },
  },
  // 渲染到页面的时候
  mounted() {
    if(this.showBarBtn) {
      this.handleSlideBar();
    }
    else{
      this.percentage = this.value;
    }
  },
  methods: {
    handleSlideBar() {
      this.slider = this.$refs.slider;
      this.thunk = this.$refs.trunk;
      this.thunk.onmousedown =  (e)=> {
        let width = parseInt(this.barwidth);
        let disX = e.clientX;
        document.onmousemove =  (e) =>{
        // value, left, width
        // 当value变化的时候，会通过计算属性修改left，width

          // 拖拽的时候获取的新width
          let newWidth = e.clientX - disX + width;
          // 拖拽的时候得到新的百分比
          let scale = newWidth / this.slider.offsetWidth;
          this.percentage = Math.ceil((this.max - this.min) * scale + this.min);
          this.percentage = Math.max(this.percentage, this.min);
          this.percentage = Math.min(this.percentage, this.max);
          this.$emit('input', this.percentage);
        };
        document.onmouseup = ()=> {
          document.onmousemove = document.onmouseup = null;
        };
        return false;
      };
    },
    // 按钮 - 增加
    handleIncrease() {
      if(percentage < max) {
        this.percentage++;
        this.$emit('increase',this.percentage);
        this.$emit('change',this.percentage);
      }
    },
    // 按钮 - 减少
    handleDecrease() {
      if(percentage > min) {
        this.percentage--;
        this.$emit('decrease',this.percentage);
        this.$emit('change',this.percentage);
      }
    }
  }
};
</script>

  <style scoped>
  .box {
    margin: 100px auto 0;
    width: 80%;
  }

  .clear::after {
    content: "";
    display: block;
    clear: both;
  }

  .slider {
    user-select: none;
    position: relative;
    cursor: pointer;
  }

  .slider .slider-process {
    position: absolute;
    left: 0;
    top: 0;
    height: inherit;
  }

  .slider .thunk {
    position: absolute;
    left: 100px;
    top: -10px;
    width: 20px;
    height: 20px;
  }

  .slider .block {
    width: 14px;
    height: 27px;
    border-radius: 5px;
    background: #fff;
    transition: 0.2s all;
  }

  .slider .block:hover {
    transform: scale(1.1);
  }
</style>