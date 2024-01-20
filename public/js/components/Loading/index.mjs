const { h, Component, render } = preact
const html = htm.bind(h)

export class LoadingComponent extends Component {
  render() {
    return html`
      <div class="flex items-center justify-center h-screen w-full">
        <div
          class="animate-spin rounded-full h-32 w-32 border-b-4  dark:border-white border-red-700"
        ></div>
      </div>
    `
  }
}
