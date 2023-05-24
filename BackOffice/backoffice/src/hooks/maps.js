
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = "pk.eyJ1IjoieW9zcmNoYXJlayIsImEiOiJjbGhtbm4wdmYwMGp4M2VwZWo1Mmd4aGUzIn0.MnRTZw6VNhrxhqX7pjJ7sQ";
function Maps() {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [9.561555, 33.892166],
      zoom: 12,
      attributionControl: false // Désactiver les attributions de Mapbox
    });

    // Clean up the map instance when the component unmounts
    return () => {
      map.remove();
    };
  }, []); // Empty dependency array to run the effect only once

  return <div id="map" style={{ width: '100%', height: '500px' }}/>;
}

export default Maps;

