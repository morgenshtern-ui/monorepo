import { getRect } from '@teleskop-labs/css-box-model'
import type { BoxModel, Rect, Spacing } from '@teleskop-labs/css-box-model'
import type {
  DroppableSubject,
  PlaceholderInSubject,
  Scrollable,
} from '../../../types.js'
import { offsetByPosition } from '../../spacing.js'
import type { Axis } from '../../axis.js'
import { getIntersectingRect } from './getIntersectingRect.js'

interface Args {
  page: BoxModel
  withPlaceholder: PlaceholderInSubject | null
  axis: Axis
  frame: Scrollable | null
}

/**
 * Получает объект DroppableSubject на основе переданных параметров.
 *
 * @param {Args} args - Объект с параметрами: ось, frame, страница и заполнитель.
 * @returns {DroppableSubject} Возвращает объект DroppableSubject.
 */
export function getSubject({ axis, frame, page, withPlaceholder }: Args): DroppableSubject {
  const scrolled: Spacing = scroll(page.marginBox, frame)
  const increased: Spacing = increase(scrolled, axis, withPlaceholder)
  const clipped: Rect | null = clip(increased, frame)

  const subject: DroppableSubject = {
    active: clipped,
    page,
    withPlaceholder,
  }

  return subject
}

/**
 * Прокручивает цель на значение прокрутки рамки.
 *
 * @param {Spacing} target - Цель для прокрутки.
 * @param {Scrollable | null} frame - Рамка, содержащая информацию о прокрутке.
 * @returns {Spacing} Возвращает прокрученную цель.
 */
function scroll(target: Spacing, frame?: Scrollable | null): Spacing {
  if (!frame)
    return target

  return offsetByPosition(target, frame.scroll.diff.displacement)
}

/**
 * Увеличивает цель на значение заполнителя, если он есть.
 *
 * @param {Spacing} target - Цель для увеличения.
 * @param {Axis} axis - Ось, по которой происходит увеличение.
 * @param {PlaceholderInSubject | null} withPlaceholder - Заполнитель, содержащий информацию об увеличении.
 * @returns {Spacing} Возвращает увеличенную цель.
 */
function increase(target: Spacing, axis: Axis, withPlaceholder?: PlaceholderInSubject | null): Spacing {
  if (!withPlaceholder?.increasedBy)
    return target

  const increasedBy: Spacing = {
    ...target,
    [axis.end]: target[axis.end] + withPlaceholder.increasedBy[axis.line],
  }

  return increasedBy
}

/**
 * Обрезает цель по рамке, если это необходимо.
 *
 * @param {Spacing} target - Цель для обрезки.
 * @param {Scrollable | null} frame - Рамка, содержащая информацию о необходимости обрезки.
 * @returns {Rect | null} Возвращает обрезанную цель или null, если обрезка не требуется.
 */
function clip(target: Spacing, frame?: Scrollable | null): Rect | null {
  if (!frame || !frame.shouldClipSubject)
    return getRect(target)

  return getIntersectingRect(frame.pageMarginBox, target)
}
