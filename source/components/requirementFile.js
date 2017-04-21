Vue.component('requirementFile', {
  template: `
      <li
        class="c-tree__item" :class="[expanded ? expandedClass : expandableClass]"
        >
        <span
          class="c-link c-link--success"
          v-on:click.stop="handleClick"
          >
          {{requirementFileName}}
        </span>
        <ul class="c-tree" v-show="expanded && requirementTypes.length > 0" v-for="type in requirementTypes">
          <requirementType :typePrefix="type.prefix"></requirementType>
        </ul>
      </li>`,
  props: {
    fileName: String,
  },
  // eslint-disable-next-line object-shorthand, func-names
  data: function () {
    return {
      expanded: false,
      expandedClass: 'c-tree__item--expanded',
      expandableClass: 'c-tree__item--expandable',
    };
  },
  computed: {
    requirementFileName() {
      return this.fileName;
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
