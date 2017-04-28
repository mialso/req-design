Vue.component('mainContent', {
  render(createElement) {
    return createElement(this.view);
  },
  computed: {
    view() {
      return this.$store.state.view.current;
    },
  },
});
