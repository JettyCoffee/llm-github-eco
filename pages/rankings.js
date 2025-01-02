import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Rankings() {
    const router = useRouter();

    useEffect(() => {
        window.location.href = 'http://121.36.246.231:5000/leaderboard/';
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            正在跳转到排行榜页面...
        </div>
    );
}