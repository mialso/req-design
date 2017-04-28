Vue.component('requirementList', {
  template: `
    <div>
      <requirementFile
        v-for="fileName in fileNames" :key="fileName"
        :fileName="fileName"
        >
      </requirementFile>
    </div>`,
  computed: {
    fileNames() { return this.$store.state.requirement.reqList || []; },
  },
});
