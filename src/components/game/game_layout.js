import React from 'react';

import PlayArea from '../play area/play_area.js';

import './game_layout.css';

const Layout = () => {
    return (
        <>
            <header className="userdata">
                <ul>
                    <li>Player:</li>
                    <li>Score:</li>
                    <li>
                        <button className="quit">Quit</button>
                    </li>
                </ul>
            </header>

            <PlayArea />
        </>
    );
};

export default Layout;