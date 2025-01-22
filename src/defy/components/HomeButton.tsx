import React from 'react';
import { FaHome } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { Link } from "react-router-dom";

const HomeButton = () => {
    return (
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="home-button-panel">
                <Link to="/">
                    <FaHome style={{ verticalAlign: 'middle' }} />
                </Link>
            </div>
        </IconContext.Provider>
    )
}

export default HomeButton;