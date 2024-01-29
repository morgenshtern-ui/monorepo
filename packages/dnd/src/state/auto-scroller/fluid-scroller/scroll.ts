import type { Position, Rect } from '@teleskop-labs/css-box-model'
import type {
  DraggableDimension,
  DraggingState,
  DroppableDimension,
  DroppableId,
  Viewport,
} from '../../../types'
import whatIsDraggedOver from '../../droppable/what-is-dragged-over'
import getBestScrollableDroppable from './get-best-scrollable-droppable.js'
import { getWindowScrollChange } from './getWindowScrollChange.js'
import { getDroppableScrollChange } from './getDroppableScrollChange.js'
import type { AutoScrollerOptions } from './auto-scroller-options-types.js'

interface Args {
  state: DraggingState
  dragStartTime: number
  shouldUseTimeDampening: boolean
  scrollWindow: (scroll: Position) => void
  scrollDroppable: (id: DroppableId, scroll: Position) => void
  getAutoScrollerOptions: () => AutoScrollerOptions
}

export function scroll({
  dragStartTime,
  getAutoScrollerOptions,
  scrollDroppable,
  scrollWindow,
  shouldUseTimeDampening,
  state,
}: Args): void {
  const center: Position = state.current.page.borderBoxCenter
  const draggable: DraggableDimension
    = state.dimensions.draggables[state.critical.draggable.id]
  const subject: Rect = draggable.page.marginBox

  // 1. Can we scroll the viewport?
  if (state.isWindowScrollAllowed) {
    const viewport: Viewport = state.viewport
    const change: Position | null = getWindowScrollChange({
      center,
      dragStartTime,
      getAutoScrollerOptions,
      shouldUseTimeDampening,
      subject,
      viewport,
    })

    if (change) {
      scrollWindow(change)

      return
    }
  }

  const droppable: DroppableDimension | null = getBestScrollableDroppable({
    center,
    destination: whatIsDraggedOver(state.impact),
    droppables: state.dimensions.droppables,
  })

  if (!droppable)
    return

  const change: Position | null = getDroppableScrollChange({
    center,
    dragStartTime,
    droppable,
    getAutoScrollerOptions,
    shouldUseTimeDampening,
    subject,
  })

  if (change)
    scrollDroppable(droppable.descriptor.id, change)
}
