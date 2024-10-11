import React, { useState } from 'react';
import PlayArea from '../play area/play_area.js';  // Only import PlayArea, not Player
import './game_layout.css';

// Ensure Player is not being used as a React component
import { Player } from '../play area/play_area.js';  // Import as a utility class

const Layout = () => {
    const [player] = useState(new Player('Kingsley')); // Create a Player instance
    console.log(player.score)
    return (
        <>
            <header className="userdata">
                <ul>
                    <li>
                        <button className="quit">Quit</button>
                    </li>
                </ul>
            </header>

            {/* Pass player as a prop to PlayArea */}
            <PlayArea player={player} />
        </>
    );
};

export default Layout;
