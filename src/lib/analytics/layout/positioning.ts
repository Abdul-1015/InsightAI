import type { WidgetPosition, WidgetSize, DashboardWidget } from "./types";
import { getGridWidth, getGridHeight } from "./sizing";

const GRID_COLUMNS = 12;

interface GridCell {
  occupied: boolean;
  widgetId: string | null;
}

function createGrid(maxRows: number): GridCell[][] {
  return Array.from({ length: maxRows }, () =>
    Array.from({ length: GRID_COLUMNS }, () => ({
      occupied: false,
      widgetId: null,
    }))
  );
}

function findAvailablePosition(
  grid: GridCell[][],
  width: number,
  height: number
): { x: number; y: number } | null {
  for (let y = 0; y < grid.length - height + 1; y++) {
    for (let x = 0; x <= GRID_COLUMNS - width; x++) {
      let canPlace = true;
      
      for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
          if (grid[y + dy][x + dx].occupied) {
            canPlace = false;
            break;
          }
        }
        if (!canPlace) break;
      }
      
      if (canPlace) {
        return { x, y };
      }
    }
  }
  
  return null;
}

function placeWidget(
  grid: GridCell[][],
  widgetId: string,
  position: { x: number; y: number },
  width: number,
  height: number
): void {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      grid[position.y + dy][position.x + dx].occupied = true;
      grid[position.y + dy][position.x + dx].widgetId = widgetId;
    }
  }
}

export function generateWidgetPositions(
  widgets: Omit<DashboardWidget, 'position'>[]
): DashboardWidget[] {
  const maxRows = 20;
  const grid = createGrid(maxRows);
  const positionedWidgets: DashboardWidget[] = [];
  
  for (const widget of widgets) {
    const width = getGridWidth(widget.size);
    const height = getGridHeight(widget.size);
    
    const position = findAvailablePosition(grid, width, height);
    
    if (position) {
      placeWidget(grid, widget.id, position, width, height);
      
      positionedWidgets.push({
        ...widget,
        position: {
          x: position.x,
          y: position.y,
          w: width,
          h: height,
        },
      });
    }
  }
  
  return positionedWidgets;
}
