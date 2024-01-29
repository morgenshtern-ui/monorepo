import type { DraggingState, State } from '../../types.js'

export interface AutoScroller {
  start: (state: DraggingState) => void
  stop: () => void
  scroll: (state: State) => void
}
