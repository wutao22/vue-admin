<template>
  <el-dialog title="预览" :visible.sync="showModal" @close="closed()">
    <video
      :src="videoUrl"
      v-if="videoUrl"
      autoplay
      style="height: 600px; width: 800px"
    ></video>
    <img :src="url" v-if="url" alt="" style="width: 100%;height: 100%;"/>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    url: {
      type: String,
      require: true,
    },
    videoUrl: {
      type: String,
    },
  },
  computed: {
    showModal: {
      get () {
        return this.show
      },
      set(v) {
        return v
      }
    }
  },
  methods: {
    closed() {
        this.$emit('closed')
        this.showModal = false
    }
  },
};
</script>

<style>
</style>