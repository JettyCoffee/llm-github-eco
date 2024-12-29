// components/Header.js
import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="header">
            <h1>项目仪表板</h1>
            <div>
                <Link href="/">
                    <button className="change-projects-btn">更改项目</button>
                </Link>
            </div>
            <style jsx>{`
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    margin: 0;
                    font-size: 24px;
                    color: #202124;
                }
                .change-projects-btn {
                    padding: 8px 16px;
                    background-color: #1a73e8;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }
                .change-projects-btn:hover {
                    background-color: #1669c1;
                }
            `}</style>
        </header>
    );
};

export default Header;
