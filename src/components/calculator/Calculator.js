import React,{useRef, useEffect, useState} from 'react'
import './Calculator.css'
import { btns, BTN_ACTIONS } from '../store/reducers/btnConfig'


const Calculator = () => {

    const btnsRef = useRef(null);
    const expRef = useRef(null);

    const [express, setExpress] = useState('')

    useEffect(()=>{
        const btns = Array.from(btnsRef.current.querySelectorAll('button'));

        btns.forEach(e => e.style.height = e.offsetWidth + 'px')
    }, []);

    const btnClick = (item) =>{
        console.log(item);

        const expDiv = expRef.current;

        if(item.action === BTN_ACTIONS.THEME) document.body.classList.toggle('dark');

        if(item.action === BTN_ACTIONS.ADD){
            addAnimSpan(item.display)

            const operate = item.display !== 'x' ? item.display : '*';
            setExpress(express + operate)
        }

        if(item.action === BTN_ACTIONS.DELETE){
            expDiv.parentNode.querySelector('div:last-child').innerHTML = '';
            expDiv.innerHTML = '';

            setExpress('')
        }

        if(item.action === BTN_ACTIONS.CALC){
            if(express.trim().length <= 0) return;

            expDiv.parentNode.querySelector('div:last-child').remove();

            const cloneNode = expDiv.cloneNode(true);
            expDiv.parentNode.appendChild(cloneNode);

            const transform = `translateY(${-(expDiv.offsetHeight + 10) + 'px'}) scale(0.4)`;

            try{
                let res = eval(express);

                setExpress(res.toString());

                setTimeout(() =>{
                    cloneNode.style.transform = transform;
                    expDiv.innerHTML = '';
                    addAnimSpan(Math.floor(res * 100000000) / 100000000)
                }, 200)
            }catch{
                setTimeout(() =>{
                    cloneNode.style.transform = transform;
                    cloneNode.innerHTML = 'syntax err';                    
                }, 200)
            }finally{
                console.log('calc complete');
            }
        }
    }

    const addAnimSpan = (content) =>{
        const expDiv = expRef.current;
        const span = document.createElement('span');

        span.innerHTML = content;
        span.style.opacity = '0';
        expDiv.appendChild(span);

        const width = span.offsetWidth + 'px';
        span.style.width = '0';       

        setTimeout(() =>{
            span.style.opacity = '1';
            span.style.width = width;
        }, 100)
    }

  return (
    <div className='calculator'>
        <div className='calculator_result'>
            <div ref={expRef} className='calculator_result_exp'></div>
            <div className='calculator_result_exp'></div>
        </div>
        <div ref={btnsRef} className='calculator_btns'>
            {
                btns.map((item, index)=>(
                    <button key={index} className={item.class} onClick={() => btnClick(item)}>
                        {item.display}
                    </button>
                ))
            }
        </div>
      
    </div>
  )
}

export default Calculator
