Vue.component('modelText', {
  template: `
    <span class="c-badge">
      {{text}}
    </span>`,
  props: {
    text: String,
  },
});
Vue.component('requirementText', {
  render(createElement) {
    const data = this.text.split(' ')
      .map((textPart) => {
        const word = textPart
          .replace(/\W/g, '')
          .replace(/[^aeiouy]s\b/, (m, o, s) => s.slice(o, o + 1));
        if (this.domainModels.indexOf(word) !== -1) {
          return createElement('modelText', { props: { text: textPart, word } });
        }
        return textPart;
      })
      .reduce((acc, item) => {
        if (acc.length === 0) {
          acc.push(item);
          return acc;
        }
        if (typeof acc[acc.length - 1] === 'string') {
          if (typeof item === 'string') {
            acc[acc.length - 1] = `${acc[acc.length - 1]} ${item}`;
          } else {
            acc.push(item);
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    return createElement(
      'span',
      { on: { mouseup: this.handleMouseup } },
      data);
  },
  props: {
    text: {
      type: String,
      required: true,
      default: '',
    },
  },
  computed: {
    domainModels() {
      return this.$store.getters.domainModels || [];
    },
  },
  methods: {
    handleMouseup(event) {
      if (event.button === 0) {
        // console.log('up: %o', event);
        const selection = document.getSelection();
        const offset = selection.anchorOffset;
        const data = selection.anchorNode.data;
        // console.log('current: <%s>', data.slice(offset, offset + 1));
        let start = offset;
        const isLetter = index => /\w/.test(data[index]);
        while (start > 0 && start < (data.length - 1)) {
          if (!isLetter(start)) {
            start += 1;
            if (isLetter(start)) break;
          } else {
            start -= 1;
          }
        }
        // console.log('start: %s', start);
        let end = start;
        while (end < data.length) {
          end += 1;
          if (!isLetter(end)) {
            break;
          }
        }
        // console.log('start: %s, end: %s', start, end);
        const word = data.slice(start, end)
          .replace(/\W/g, '')
          .replace(/[^aeiouy]s\b/, (m, o, s) => s.slice(o, o + 1));
        console.log('word: <%s>', word);
        this.$store.commit(
          'openInlineMenu',
          {
            text: word,
            top: event.clientY,
            left: event.clientX,
            autoclose: true,
            handler: () => this.$store.dispatch('toggleDomainModel', word),
          });
        // console.log('word: <%s>', word);
      }
    },
  },
});
