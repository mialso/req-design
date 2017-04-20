Vue.component('requirementFile', {
  template: `
    <div>
      <div>
        <span>
          {{requirementFileName}}
        </span>
        <button v-on:click="openRequirement">></button>
      </div>
      <div v-if="requirementData">
        <div v-for="req in requirementData">
          <requirement :reqName="req.name" :items="req.items"></requirement>
        </div>
      </div>
    </div>`,
  props: {
    fileName: String,
  },
  computed: {
    requirementFileName() {
      return this.fileName;
    },
    requirementData() {
      const reqData = this.$store.getters.requirements(this.fileName);
      return Object.keys(reqData)
        .map(key => ({ name: key, items: reqData[key] }));
    },
  },
  methods: {
    openRequirement() {
      this.$store.dispatch('getRequirement', this.fileName);
    },
  },
});
