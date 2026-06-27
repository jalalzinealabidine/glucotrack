export function getGlucoseStatus(value) {
  const glucose = Number(value);

  if (Number.isNaN(glucose)) return { label: 'Unknown', className: 'status-neutral' };
  if (glucose < 70) return { label: 'Low', className: 'status-low' };
  if (glucose <= 180) return { label: 'In range', className: 'status-good' };
  return { label: 'High', className: 'status-high' };
}

export function average(numbers) {
  if (!numbers.length) return 0;
  const sum = numbers.reduce((total, number) => total + Number(number), 0);
  return Math.round(sum / numbers.length);
}

export function sum(numbers) {
  return numbers.reduce((total, number) => total + Number(number), 0);
}
