Vue.component('modelList', {
  template: `
    <div class="modelList">
      <div class="o-grid o-grid--wrap u-letter-box--medium">
        <div
          class="o-grid__cell"
          v-for="model in models" :key="model.name"
        >
          <span
            class="c-badge" v-bind:class="cssClass(model)"
            v-on:click="setCurrentModel(model.name)"
          >
            {{model.name}}
          </span>
        </div>
        <div
          v-if="missedModels.length > 0"
          class="o-grid__cell"
          v-for="name in missedModels" :key="name"
        >
          <span
            class="c-badge c-badge--error"
          >
            {{name}}
          </span>
        </div>
      </div>
      <modelList v-if="children.length > 0" :models="children" :missedModels="missedNames"></modelList>
    </div>`,
  props: {
    models: {
      type: Array,
      default: [],
    },
    missedModels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentModelName: '',
    };
  },
  computed: {
    children() {
      return this.currentModelName
        ? this.$store.getters.modelChildren(this.currentModelName)
        : [];
    },
    missedNames() {
      return this.currentModelName
        ? this.$store.getters.missedNames(this.currentModelName)
        : [];
    },
  },
  methods: {
    setCurrentModel(modelName) {
      this.currentModelName = (this.currentModelName === modelName)
        ? ''
        : modelName;
    },
    cssClass(model) {
      let cssClass = '';
      if (this.currentModelName !== model.name) {
        cssClass += 'c-badge--ghost';
      }
      if (model.hasA.length === 0) {
        cssClass += ' c-badge--rounded';
      }
      cssClass += ' c-badge--brand';
      return cssClass;
    },
  },
  watch: {
    models(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.currentModelName = '';
      }
    },
  },
});
