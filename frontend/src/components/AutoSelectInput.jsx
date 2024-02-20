import React, { useRef, useEffect} from 'react'

function AutoSelectInput({ cPlaceholder, cClass, cType, cName, cValue, eChange, eKeyup }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus();
        }
    }, []);

    return <input ref={inputRef} type={cType} className={cClass} name={cName} value={cValue} placeholder={cPlaceholder} onChange={eChange} onKeyUp={eKeyup}/>
}

export default AutoSelectInput;