export function format_time(date: string, current_time: Date) {
	const diff = current_time.getTime() - new Date(date).getTime();
	const seconds = Math.floor(diff / 1000);
	if (seconds <= 0) return 'just now';
	if (seconds < 60) return `${seconds} seconds ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} minutes ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hours ago`;
	const days = Math.floor(hours / 24);
	return `${days} days ago`;
}
