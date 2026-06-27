import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

export function todayDateInput() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function currentTimeInput() {
  return format(new Date(), 'HH:mm');
}

export function combineDateTime(date, time) {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function formatDateTime(isoString) {
  if (!isoString) return 'No date';
  return format(parseISO(isoString), 'dd/MM/yyyy HH:mm');
}

export function formatTime(isoString) {
  if (!isoString) return '--:--';
  return format(parseISO(isoString), 'HH:mm');
}

export function filterByDate(logs, selectedDate) {
  const target = new Date(`${selectedDate}T00:00:00`);
  return logs.filter((log) => isSameDay(parseISO(log.measuredAt || log.injectedAt), target));
}

export function getWeekDays(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function getDayLabel(date) {
  return format(date, 'EEE');
}

export function isoToDateInput(isoString) {
  if (!isoString) return todayDateInput();
  return format(parseISO(isoString), 'yyyy-MM-dd');
}

export function isoToTimeInput(isoString) {
  if (!isoString) return currentTimeInput();
  return format(parseISO(isoString), 'HH:mm');
}
