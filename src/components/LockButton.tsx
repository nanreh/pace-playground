import React from 'react';
import { MdLock } from 'react-icons/md';
import { IconContext } from 'react-icons'

interface Props {
    unlockCb: () => void,
}

const LockButton = ({ unlockCb }: Props) => {
    return (
        <IconContext.Provider value={{ color: "#fed766", size: "1.5em" }}>
            <div className="lock-button-panel" onClick={unlockCb}>
                <MdLock style={{ verticalAlign: 'middle' }} />
            </div>
        </IconContext.Provider>
    )
}

export default LockButton;