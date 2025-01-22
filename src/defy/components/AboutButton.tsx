import React from 'react';
import { FaInfoCircle } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { Link } from "react-router-dom";

const AboutButton = () => {
    return (
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="about-button-panel">
                <Link to="/about">
                    <FaInfoCircle style={{ verticalAlign: 'middle' }} />
                </Link>
            </div>
        </IconContext.Provider>
    )
}

export default AboutButton;