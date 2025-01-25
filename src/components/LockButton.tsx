import { MdLock } from 'react-icons/md';
import { IconContext } from 'react-icons'

interface Props {
    unlockCb: () => void,
}

const LockButton = ({ unlockCb }: Props) => {
    return (
        <IconContext.Provider value={{ size: "1.5em" }}>
            <div className="tool-button lock-button" onClick={unlockCb}>
                <MdLock style={{ verticalAlign: 'middle' }} />
            </div>
        </IconContext.Provider>
    )
}

export default LockButton;