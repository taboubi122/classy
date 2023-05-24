import React from 'react';
import {BsTwitter,BsInstagram,BsFacebook} from "react-icons/bs";
import {FiChevronRight} from "react-icons/fi";
import img1 from '../Assets/Photos/6.png';

const Footer= () =>{
    return(
        <section className='footer' style={{ backgroundImage: `url(${img1})` }}>
        <div className="sesContent container">
           
            <div className="footerCard flex">
                <div className="footerIntro flex">
                    <div className="logoDiv">
                        <a href="#" className='logo flex'>
                            Classy
                        </a>
                    </div>
                  
                    <div className="footerSocial">
                    <BsFacebook className="icon"/>
                    <BsInstagram className="icon"/>
                    <BsTwitter className="icon"/>
                    </div>
                </div>
                <div className="Links">
                <div className="footerLinks grid">
                    <div className="linkGroup">
                        <span className="groupTitle">
                        Trouvez votre prestation
                        </span>
                        <li className="footerList flex">
                            <FiChevronRight className='icon'/>
                           Coiffeur
                        </li>
                        <li className="footerList flex">
                            <FiChevronRight className='icon'/>
                           Institut de beauté
                        </li>
                        <li className="footerList flex">
                            <FiChevronRight className='icon'/>
                           Barbier
                        </li>
                        <li className="footerList flex">
                            <FiChevronRight className='icon'/>
                           Manucure et soin
                        </li>
                    </div>
                </div>
                <div className="footerLinks grid">
                    <div className="linkGroup">
                        <span className="groupTitle">
                        Contact
                        </span>
                        <li className="footerList flex">
                          classy@gmail.com
                        </li>
                        <li className="footerList flex">
                          70 681 801
                        </li>
                        <li className="footerList flex"/>
                          
                       
                        <li className="footerList flex"/>
                            
                    </div>
                </div>
                <div className="footerLinks grid">
                    <div className="linkGroup">
                        <span className="groupTitle">
                        A propos de Classy
                        </span>
                        <li className="footerList flex">
                          Ajouter un établissement
                        </li>
                        <li className="footerList flex">
                          Rejoignez nous
                        </li>
                        <li className="footerList flex"/>
                           
                        <li className="footerList flex"/>
                            
                    </div>
                </div>
                </div>
                <div className="footerDiv flex">
                    <small>Copyright &copy; CLASSY 2023</small>
                </div>
            </div>
        </div>
       </section>
    )
}

export default Footer