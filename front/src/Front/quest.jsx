import React from 'react';
import quest from './hooks/quest';

const Quest= () =>{

    const [text,text2,text3,text4,text5,Icon]=quest();
    return(
        <section className='quest'  >
            <div className='container'>
            <div className="footerLinks grid">
                <h1>Les questions fréquentes </h1>
                    <div className="linkGroup">
                        <li className="footerList flex">
                            Qu`est ce que Classy ?
                            <span className='icon'>{Icon}</span>
                            
                        </li>
                        <span className='sousPara'> {text}</span> 
                        <hr />
                        <li className="footerList flex">
                            Comment prendre rendez-vous sur Classy ?
                            <span className='icon'>{Icon}</span>
                        </li>
                        <span className='sousPara'> {text2}</span> 
                        <hr />
                        <li className="footerList flex">
                            Est ce que je dois payer en ligne sur Classy ?
                            <span className='icon'>{Icon}</span>
                        </li>
                        <span className='sousPara'> {text3}</span> 
                        <hr />
                        <li className="footerList flex">
                            Comment gérer mes rendez-vous sur Classy ?
                            <span className='icon'>{Icon}</span>
                        </li>
                        <span className='sousPara'> {text4}</span> 
                        <hr />
                        <li className="footerList flex">
                            Comment faire apparaitre mon salon ou institut sur Classy ?
                            <span className='icon'>{Icon}</span>
                        </li>
                        <span className='sousPara'> {text5}</span> 
                        <hr />
                        <li className="son">
                           <br/>
                           <br/>
                        </li>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Quest