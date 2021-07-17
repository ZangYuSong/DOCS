<template>
  <div class="ml-message">{{ message }}</div>
</template>
<script>
export default {
  data() {
    return {
      message: ""
    };
  },
  model: {
    prop: "data",
    event: "data"
  },
  components: { component },
  directives: { directive },
  filters: { filter },
  created() {},
  beforeRouteEnter(to, from, next) {},
  props: ["data"],
  methods: {
    click() {}
  },
  watch: {
    message(val, oldVal) {}
  }
};
</script>
<style scoped>
.ml-message {
  color: red;
}
</style>

