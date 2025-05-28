import { ScheduleEvent } from "./types";

interface EventComponentProps {
  event: ScheduleEvent;
  role?: string;
  view: string;
  onDelete: (event: ScheduleEvent) => void;
  onEdit: (event: ScheduleEvent) => void;
  onSelect: (event: ScheduleEvent) => void;
}

export function EventComponent({ event, onSelect }: EventComponentProps) {
  return (
    <div
      className="flex items-center justify-between w-full h-full p-1 cursor-pointer"
      onClick={() => onSelect(event)}
    >
      <span className="text-sm">{event.title}</span>
    </div>
  );
}
