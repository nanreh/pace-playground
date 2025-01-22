import React, { useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa'
import { IconContext } from 'react-icons'

type plusOrMinus = 'plus' | 'minus';

interface Props {
    activeCb: () => void,
    doneCb: () => void,
    type: plusOrMinus,
}

let timerID: number | undefined;

const LongPressButton = ({ activeCb, doneCb, type }: Props) => {

    const timer = useCallback(
        () => {
            timerID = window.setInterval(function doCb() {
                activeCb();
            }, 100);
        },
        [activeCb],
    );

    function pressingDown(e: React.MouseEvent | React.TouchEvent) {
        timer();
        console.log(e);
        e.preventDefault();
    }

    function notPressingDown(e: React.MouseEvent | React.TouchEvent) {
        // Stop the timer
        if (undefined !== timerID) {
            clearInterval(timerID);
        }
        doneCb();
    }

    // create element ref
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (innerRef && innerRef.current) {
            const div = innerRef.current;
            const cancel = (event: TouchEvent) => event.preventDefault();
            div.addEventListener('touchstart', cancel, { passive: false });
            div.addEventListener('touchend', cancel, { passive: false });
            return () => {
                div.removeEventListener('touchend', cancel);
            }
        }
    }, []);

    return (
        <IconContext.Provider value={{ color: "#fed766", size: "1.5em" }}>
            <div className="long-press-button-panel" ref={innerRef} onMouseDown={pressingDown} onMouseUp={notPressingDown} onMouseLeave={notPressingDown}
                onTouchStart={pressingDown} onTouchEnd={notPressingDown}>
                {type === 'plus' && <FaPlus style={{ verticalAlign: 'middle' }} />}
                {type === 'minus' && <FaMinus style={{ verticalAlign: 'middle' }} />}
            </div>
        </IconContext.Provider>
    )
}

export default LongPressButton;
