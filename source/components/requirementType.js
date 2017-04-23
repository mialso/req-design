Vue.component('requirementType', {
  template: `
    <li 
      class="c-tree__item" :class="[expanded ? expandedClass : expandableClass]"
      >
      <span
        class="c-link c-link--warning"
        v-on:click.stop="handleClick"
        >
        {{typePrefix}}
      </span>
      <ul class="c-tree" v-show="expanded && requirements.length > 0"  v-for="req in requirements">
        <requirement v-if="req.relation.length === 0" :item="req"></requirement>
        <requirementExpandable v-if="req.relation.length > 0" :item="req"></requirementExpandable>
      </ul>
    </li>`,
  props: {
    typePrefix: String,
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
    requirements() {
      return this.$store.getters.requirements(this.typePrefix);
    },
  },
  methods: {
    handleClick() {
      this.expanded = !this.expanded;
    },
    expand() {
      this.expanded = true;
    },
    close() {
      this.expanded = false;
    },
  },
});
