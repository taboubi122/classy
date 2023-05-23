import React from 'react';
import img1 from '../Assets/Photos/digital.png';

const Digitale= () =>{
    return(
        <section className='Digitale'  >
            <div className='container'>
                <h2>Professionnel</h2>
                <div className="img-container">
                <img className="span-3 image-grid-row-2" src={img1} alt='1'/>
                <div>
                  <h3 className='digital'> Classy recherche des profils dans toute la Tunisie 
                    pour digitaliser le secteur de la beauté
                   <br/>
                     </h3><button className='btn2'>Découvrir nos offres</button>
                    </div>
               </div>
            
            </div>
        </section>
    )
}

export default Digitale