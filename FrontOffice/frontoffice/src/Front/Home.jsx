import React from 'react';
import Main from './Main';
import Footer from './Footer';
import Quest from './quest';
import Digitale from './Digitale';
import Navbar from './Navbar/navbar';
import BarRecherche from './BarRecherche/BarRechere';

const Home = ({ isLoggedIn, handleLogout }) => {
  const scrollThreshold = "header";
  console.log(handleLogout)

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} change={scrollThreshold}/>
      <BarRecherche isLoggedIn={isLoggedIn}/>
      <div className='navBarLink1' />
      <Main />
      <Digitale />
      <Quest />
      <Footer />
    </>
  );
};

export default Home;
