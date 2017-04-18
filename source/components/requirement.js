Vue.component('requirement', {
  template: `
    <div>
      <div>
        <div>
          {{requirementName}}
        </div>
        <button v-on:click="openRequirement">\></button>
      </div>
      <div v-if="requirementData">
        {{requirementData}}
      </div>
    </div>`,
  props: {
    fileName: String,
  },
  computed: {
    requirementName () {
      return this.fileName//.split('.').slice(0,-1).join('.')
    },
    requirementData () {
      return this.$store.getters.requirements(this.fileName)
    },
  },
  methods: {
    openRequirement() {
      this.$store.dispatch('getRequirement', this.fileName)
    }
  }
})
