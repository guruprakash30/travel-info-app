import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "./App.css"


const MapCurrent = () => {

    const [position,setPosition] = useState(null);

    const maps = {
        base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      };

    useEffect(()=>{
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({long:pos.coords.longitude, lat:pos.coords.latitude});
      });
    },[])

    return (
        <>
        {position && <MapContainer center={[position.lat,position.long]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[position.lat,position.long]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>}
        </>
    );
}
 
export default MapCurrent;