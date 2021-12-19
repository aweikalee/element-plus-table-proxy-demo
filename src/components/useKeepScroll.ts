import { onActivated, onDeactivated, Ref, watch } from 'vue'

export function useKeepScroll(el: Ref<any>) {
  let scrollTop = 0
  let scrollLeft = 0

  function save() {
    if (!el.value) return

    scrollTop = el.value.scrollTop
    scrollLeft = el.value.scrollLeft
  }
  function restore() {
    if (!el.value) return

    el.value.scrollTop = scrollTop
    el.value.scrollLeft = scrollLeft
  }

  let listenedEl: HTMLElement | null = null
  function removeEventListener() {
    listenedEl?.removeEventListener('scroll', save)
    listenedEl = null
  }
  function addEventListener() {
    if (!el.value) return
    if (listenedEl === el.value) return
    removeEventListener()

    listenedEl = el.value
    listenedEl?.addEventListener('scroll', save)
  }

  watch(el, addEventListener)
  onActivated(addEventListener)
  onDeactivated(removeEventListener)

  onActivated(restore)
}
