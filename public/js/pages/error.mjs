const { useState } = preactHooks
const html = htm.bind(preact.h)

/** fall-back route (handles unroutable URLs) */
export const Error = ({ type, url }) => {
  const [state, setState] = useState(0)

  return html`<section
    class="flex flex-col items-center justify-center w-full h-full py-4 space-y-4"
  >
    <h2>Error ${type}</h2>
    <p>It looks like we hit a snag.</p>
    <pre>${url}</pre>
    <p>
      <button
        class="dark:bg-white text-slate-700 bg-green-300 px-2 py-1 rounded-md"
        onclick=${() => setState(state - 1)}
      >
        decrease
      </button>
      <span style="margin: 0 5px">useState: ${state}</span>
      <button
        class="dark:bg-white text-slate-700 bg-green-300 px-2 py-1 rounded-md"
        onclick=${() => setState(state + 1)}
      >
        increase
      </button>
    </p>
    <a class="underline" href="/app">Go home</a>
  </section>`
}
