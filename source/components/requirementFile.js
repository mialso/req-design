Vue.component('requirementFile', {
  template: `
      <li
        class="c-tree__item" :class="[expanded ? expandedClass : expandableClass]"
        v-on:click.stop="handleClick"
        >
        <span class="c-link c-link--success">
          {{requirementFileName}}
        </span>
        <ul class="c-tree" v-show="expanded && requirementData.length > 0" v-for="req in requirementData">
          <requirement :reqName="req.name" :items="req.items"></requirement>
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
    requirementData() {
      const reqData = this.$store.getters.requirements(this.fileName);
      return Object.keys(reqData)
        .map(key => ({ name: key, items: reqData[key] }));
    },
  },
  methods: {
    handleClick() {
      this.openRequirement();
      this.expanded = !this.expanded;
    },
    openRequirement() {
      this.$store.dispatch('getRequirement', this.fileName);
    },
  },
});
