Vue.component('requirementExpandable', {
  template: `
    <li 
      class="c-tree__item" :class="[expanded ? expandedClass : expandableClass]"
      >
      <span
        :class="[related.length > 0 ? 'c-link' : '']"
        v-on:click.stop="handleClick"
        >
        {{item.text}}
      </span>
      <ul
        class="c-tree"
        v-show="expanded && related.length > 0"
        v-for="req in related"
        :key="req.text">
        <li class="c-tree__item">
          <span>{{req.text}}</span>
        </li>
      </ul>
    </li>`,
  props: {
    item: Object,
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
    related() {
      let result = [];
      this.item.relation.forEach(relation => (
        result = result.concat(this.$store.getters.relatedRequirements(relation))
      ));
      switch (this.item.type.fileName) {
        case 'high-level.json':
          return result.filter(rq => rq.type.fileName.startsWith('medium'));
        default:
          return [];
      }
    },
  },
  methods: {
    handleClick() {
      if (this.related.length === 0) return;
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
