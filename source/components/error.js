Vue.component('error', {
  template: `
    <div>
      {{errorString}}
    </div>`,
  computed: {
    errorString() { return this.$store.state.error; },
  },
});
