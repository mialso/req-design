Vue.component('modelView', {
  template: `
    <div class="model-view o-grid">
      <div
        class="o-grid__cell u-center-block"
        v-for="relation in relations"
        :key="relation"
      >
        <span class="c-badge u-center-block__content" v-on:click="showRelation(relation)">{{relation}}</span>
      </div>
      <model_level v-for="item in modelItems" :key="item.name" :items="item"></model_level>
    </div>`,
  beforeCreate() {
    this.$store.dispatch('getModelData');
  },
  computed: {
    modelItems() {
      return [];
    },
    relations() {
      return this.$store.state.model.relations;
    },
  },
  methods: {
    showRelation(name) {
      console.log(`showRelation: ${name}`);
    },
  },
});
