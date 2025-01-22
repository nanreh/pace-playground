import React from 'react';
import { FaHome } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const HomeButton = () => {
    return (
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="home-button-panel">
                <a href="/">
                    <FaHome style={{ verticalAlign: 'middle' }} />
                </a>
            </div>
        </IconContext.Provider>
    )
}

export default HomeButton;