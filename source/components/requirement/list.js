Vue.component('requirementList', {
  template: `
    <div>
      <div
        style="height: 50px;background-color: #ccc;"
        v-on:dragenter="handleDragenter($event)"
        v-on:dragleave="handleDragleave($event)"
        v-on:dragover="handleDragover($event)"
        v-on:drop="handleDrop($event)"
      >
        {{draggedText}}
      </div>
      <requirementFile
        v-for="fileName in fileNames" :key="fileName"
        :fileName="fileName"
        >
      </requirementFile>
    </div>`,
  data() {
    return {
      draggedText: 'items:',
      draggedItems: [],
    };
  },
  computed: {
    fileNames() { return this.$store.state.requirement.reqList || []; },
  },
  methods: {
    handleDragover(event) {
      event.preventDefault();
    },
    handleDrop(event) {
      const itemText = event.dataTransfer.getData('text');
      console.log('drop: %s', itemText);
      this.draggedItems.push(itemText);
      this.draggedText = `items: ${this.draggedItems.join('+')}`;
    },
    handleDragleave(event) {
      const itemText = event.dataTransfer.getData('text');
      console.log('dragleave: %s', itemText);
      this.draggedText = `items: ${this.draggedItems.join('+')}`;
    },
    handleDragenter(event) {
      event.preventDefault();
      console.log('enter: %o', event);
      const itemText = event.dataTransfer.getData('text');
      console.log('dragenter: %s', itemText);
      this.draggedText = `to be added to domain model: ${itemText}`;
    },
  },
});
