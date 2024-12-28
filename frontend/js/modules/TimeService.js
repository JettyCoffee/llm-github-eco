export class TimeService {
    static updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('current-time').textContent = timeStr;
    }

    static startTimeUpdate() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
} 