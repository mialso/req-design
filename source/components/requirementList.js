Vue.component('requirementList', {
  template: `
    <div>
      <div v-for="fileName in fileNames">
        <requirementFile :fileName="fileName"></requirementFile>
      </div>
    </div>`,
  computed: {
    fileNames() { return this.$store.state.reqList || []; },
  },
});
