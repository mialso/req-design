Vue.component('requirementFile', {
  template: `
      <div class="c-card u-high">
        <div class="c-card__item o-grid">
          <div class="o-grid__cell u-center-block">
            <span class="u-center-block__content u-center-block__content--vertical">
              {{fileName}}
            </span>
          </div>
          <div class="o-grid__cell o-grid__cell--width-30">
            <button 
              :class="[expanded ? expandedClass : expandableClass]"
              class="c-button c-button--ghost-info u-small"
              v-on:click.stop="handleClick"
              type="button"
              >
              {{expandButtonText}}
            </button>
          </div>
        </div>
        <div v-show="expanded && requirementTypes.length > 0" class="c-card__item">
          <ul class="c-tree" v-for="type in requirementTypes" :key="type.prefix">
            <requirementType :typePrefix="type.prefix"></requirementType>
          </ul>
        </div>
      </div>`,
  props: {
    fileName: String,
  },
  // eslint-disable-next-line object-shorthand, func-names
  data: function () {
    return {
      expanded: false,
      expandedClass: 'c-button--active',
      expandableClass: '',
    };
  },
  computed: {
    expandButtonText() {
      return this.expanded ? 'collapse' : 'expand';
    },
    requirementTypes() {
      return this.$store.getters.requirementTypes(this.fileName);
    },
  },
  methods: {
    handleClick() {
      this.openRequirement();
      this.expanded = !this.expanded;
    },
    openRequirement() {
      this.$store.dispatch('getRequirementFile', this.fileName);
    },
  },
});
