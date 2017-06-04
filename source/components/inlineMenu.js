Vue.component('inlineMenu', {
  template: `
    <div
      class="inline-menu"
      v-bind:style="{top: menu.top + 'px', left: menu.left + 'px'}"
      >
      <div class="c-alert" style="padding-right: 4em;">
        <button class="c-button c-button--close" style="right: 1.5em;"
          v-on:click="submit"
          >
          &#x2611;
        </button>
        <button class="c-button c-button--close"
          v-on:click="close"
          >
          &#x2612;
        </button>
        {{menu.text}}
      </div>
    </div>`,
  computed: {
    menu() {
      return this.$store.getters.inlineMenu;
    },
  },
  methods: {
    submit() {
      this.menu.handler();
      this.$store.commit('closeInlineMenu');
    },
    close() {
      this.$store.commit('closeInlineMenu');
    },
  },
});
