Vue.component('requirementList', {
  template: `
    <div>
      <div v-for="fileName in fileNames">
        <requirement :fileName="fileName"></requirement>
      </div>
    </div>`,
  computed: {
    fileNames() { return this.$store.state.reqList || []; },
  },
});
