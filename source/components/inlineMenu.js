Vue.component('inlineMenu', {
  template: `
    <div
      class="inline-menu"
      v-bind:style="{top: top + 'px', left: left + 'px'}"
      >
      <div class="c-alert" style="padding-right: 4em;">
        <button class="c-button c-button--close" style="right: 1.5em;"
          v-on:click="add"
          >
          &#x2611;
        </button>
        <button class="c-button c-button--close"
          v-on:click="close"
          >
          &#x2612;
        </button>
        {{text}}
      </div>
    </div>`,
  computed: {
    text() {
      return this.$store.getters.inlineMenu.text;
    },
    top() {
      return this.$store.getters.inlineMenu.top;
    },
    left() {
      return this.$store.getters.inlineMenu.left;
    },
  },
  methods: {
    close() {
      this.$store.commit('closeInlineMenu');
    },
    add() {
      console.log('add: <%s>', this.text);
    },
  },
});
