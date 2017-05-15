Vue.component('modelHtmlView', {
  template: `
    <div>
      <div class="o-grid u-letter-box--medium">
        <div
          class="o-grid__cell u-center-block"
          v-for="relation in relations" :key="relation"
        >
          <span
            class="c-badge u-center-block__content"
            v-bind:class="[relation !== currentRelation ? 'c-badge--ghost' : '']"
            v-on:click="showRelation(relation)"
          >
            {{relation}}
          </span>
        </div>
      </div>
      <modelList v-if="modelItems.length > 0" :models="modelItems"></modelList>
    </div>`,
  data() {
    return {
      currentRelation: 'app',
    };
  },
  computed: {
    modelItems() {
      return this.$store.getters.relatedModels(this.currentRelation);
    },
    relations() {
      return this.$store.state.model.relations;
    },
  },
  methods: {
    showRelation(name) {
      this.currentRelation = name;
    },
  },
});
