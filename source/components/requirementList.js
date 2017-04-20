Vue.component('requirementList', {
  template: `
    <div>
      <div class="c-card u-high u-window-box--medium" v-for="fileName in fileNames">
        <ul class="c-tree">
          <requirementFile :fileName="fileName"></requirementFile>
        </ul>
      </div>
    </div>`,
  computed: {
    fileNames() { return this.$store.state.reqList || []; },
  },
});
