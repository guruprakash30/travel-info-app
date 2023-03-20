import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import {
  TileLayer,
  MapContainer,
  LayersControl
} from "react-leaflet";
import { List, ListItemText } from "@material-ui/core";

import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { useParams } from "react-router-dom";
import useFetch from "./useFetch";

const Map = () => {

  const navigate = useNavigate();

  const [map, setMap] = useState(null);

  const [routingMachine, setRoutingMachine] = useState(null)

  const {id} = useParams();

  const cord = JSON.parse(id);

  const [param1,setParam1] = useState({
    format:"jsonv2",
    lat:cord[0].x,
    lon:cord[0].y
  });

  const [param2,setParam2] = useState({
    format:"jsonv2",
    lat:cord[1].x,
    lon:cord[1].y
  });

  const {data : data1} = useFetch('https://nominatim.openstreetmap.org/reverse?',param1,setParam1);

  const {data : data2} = useFetch('https://nominatim.openstreetmap.org/reverse?',param2,setParam2);


  const [start, setStart] = useState([cord[0].x, cord[0].y]);
  const [end, setEnd] = useState([cord[1].x,cord[1].y]);
  const [nameState,setNameState] = useState(null);
  const [DaysState,setDaysState] = useState(null);
  const [dateState,setDateState] = useState(null);
  const [contactState,setContactState] = useState(null);
  const [rideCountState,setRideCountState] = useState(null);
  const [coordinatesState,setCoordinatesState] = useState(null);

  const [resJsonPost,setResJsonPost] = useState(null);

  const [resJsonGet,setResJsonGet] = useState(null);

  const [displayPost,setDisplayPost] = useState('block');

  const [displayGet,setDisplayGet] = useState('none');

  const RoutingMachineRef = useRef(null);

  const handlePostClick = () =>{
    const requestBodyPost = {
      from:cord[0].f,
      to:cord[1].t,
      name:nameState,
      selectedRadioButton:document.querySelector('input[name="answerForPost"]:checked').value,
      noOfDays:DaysState,
      date:dateState,
      contact:contactState,
      rideCount:rideCountState,
      country:data1.address.country,
      coordinates:coordinatesState,
      pointA:{lat:cord[0].x,lng:cord[0].y},
      pointB:{lat:cord[1].x,lng:cord[1].y}
    }
    fetch('http://localhost:8080/details/post',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBodyPost)
    }).then(res=>res.json()).then(data=>setResJsonPost(data));
  }

  useEffect(()=>{
    if(resJsonPost!=null){
      navigate('/user/details',{state:resJsonPost})
    }
  },[resJsonPost])

  const handleGetClick = () =>{

    const requestBodyGet = {
      pointA:{lat:cord[0].x,lng:cord[0].y},
      pointB:{lat:cord[1].x,lng:cord[1].y},
      selectedRadioButton:document.querySelector('input[name="answerForGet"]:checked').value
    }

    fetch('http://localhost:8080/details/get',{
      method:"GET",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBodyGet)
    }).then(res=>res.json()).then(data=>setResJsonGet(data));

  }

  useEffect(()=>{
    if(resJsonGet!=null){
      navigate('/user/details',{state:resJsonGet})
    }
  },[resJsonGet])


  useEffect(() => {
    if (!map) return 
    if (map) {
      RoutingMachineRef.current = L.Routing.control({
        position: 'topleft',
        lineOptions: {
          styles: [
            {
              color: '#757de8',
            },
          ],
        },
        waypoints: [start, end],
      })

      RoutingMachineRef.current.on('routeselected', function(e) {
        setCoordinatesState(e.route.coordinates);
      });


      setRoutingMachine(RoutingMachineRef.current)
      
    }
  }, [map])


  useEffect(() => {
    if (routingMachine) {
      routingMachine.addTo(map)
      routingMachine.setWaypoints([start, end])
    }
  }, [routingMachine, start, end])

 

  return (
    <>
      <div className="columns">
        <div className="column is-8">
        <MapContainer
        center={[37.0902, -95.7129]}
        zoom={3}
        zoomControl={false}
        // Set the map instance to state when ready:
        whenCreated={map => setMap(map)}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Map">
          <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>
        </div>
        <div className="column is-4 my-4">
          <nav className="navbar is-white has-shadow">
            <div className="navbar-menu">
              <div className="navbar-start">
              <div className="navbar-item">
              <span className="icon">
                <i class="fa-solid fa-person-walking-luggage"></i>
                </span>
              </div>
              <div className="navbar-item">
              <span className="icon">
                <i class="fa-solid fa-car"></i>
                </span>
              </div>
              <div className="navbar-item">
              <span className="icon">
                <i class="fa-solid fa-hand-holding-dollar"></i>
                </span>
              </div>
              </div>
              <div className="navbar-end">
              <div className="navbar-item">
                  <button className="button is-light" onClick={()=>{setDisplayGet('none');setDisplayPost('block');}}>POST DETAILS</button>
                </div>
              <div className="navbar-item">
                  <button className="button is-light" onClick={()=>{setDisplayGet('block');setDisplayPost('none');}}>GET DETAILS</button>
                </div>
              </div>
            </div>
          </nav>
          <div className="" style={{"display":displayPost}}>
          <div className="mr-4">
        <fieldset className="my-2" disabled>
      <div className="field">
        <p className="control has-icons-left">
          <input type="text" className="input" value={cord[0].f}/>
          <span className="icon is-small is-left"><i className="fa-solid fa-location-arrow"></i></span>
        </p>
      </div>
      <div className="field">
        <p className="control has-icons-left">
          <input type="text" className="input" value={cord[1].t}/>
          <span className="icon is-small is-left"><i className="fa-solid fa-location-dot"></i></span>
        </p>
      </div>
      </fieldset>
  <List>
  <List className="heading has-text-weight-bold">
NAME
  <ListItemText>
  <input className="input" onChange={(event)=>setNameState(event.target.value)}/>
  </ListItemText>
</List>
  <h3 className="heading has-text-weight-bold my-3">ARE YOU ????</h3>
    <ListItemText>
    <label className="radio has-text-weight-bold heading">
    <input className="mx-1" value="HOST" type="radio" name="answerForPost"/>
    HOST
  </label>
  <label className="radio has-text-weight-bold heading">
    <input className="mx-1" value="POOL" type="radio" name="answerForPost"/>
    POOL
  </label>
    </ListItemText>
  </List>
<List className="heading has-text-weight-bold">
HOW MANY DAYS CAN WAIT IN THE QUEUE !!!
  <ListItemText>
  <input type="number" className="input" onChange={(event)=>setDaysState(event.target.value)}/>
  </ListItemText>
</List>
<List className="heading has-text-weight-bold">
WHAT IS THE DATE OF TRAVEL ???
  <ListItemText>
<input type="date" className="input" onChange={(event)=>setDateState(event.target.value)}/>
  </ListItemText>
</List>
<List className="heading has-text-weight-bold">
  CONTACT INFORMATION
  <ListItemText><input type="text" className="input" placeholder="phone number or email id" onChange={(event)=>setContactState(event.target.value)}/></ListItemText>
</List>
<List className="heading has-text-weight-bold">
  HOW MANY CAN JOIN THE RIDE ???
  <ListItemText><input type="number" className="input" onChange={(event)=>setRideCountState(event.target.value)}/></ListItemText>
</List>
<button onClick={handlePostClick} className="button is-dark">POST</button>
</div>
          </div>

          <div className="" style={{"display":displayGet}}>
            <div className="mr-4">
            <fieldset className="my-2" disabled>
      <div className="field">
        <p className="control has-icons-left">
          <input type="text" className="input" value={cord[0].f}/>
          <span className="icon is-small is-left"><i className="fa-solid fa-location-arrow"></i></span>
        </p>
      </div>
      <div className="field">
        <p className="control has-icons-left">
          <input type="text" className="input" value={cord[1].t}/>
          <span className="icon is-small is-left"><i className="fa-solid fa-location-dot"></i></span>
        </p>
      </div>
      </fieldset>
      <List>
      <h3 className="heading has-text-weight-bold my-3">Looking AS????</h3>
    <ListItemText>
    <label className="radio has-text-weight-bold heading">
    <input className="mx-1" value="HOST" type="radio" name="answerForGet"/>
    HOST
  </label>
  <label className="radio has-text-weight-bold heading">
    <input className="mx-1" value="POOL" type="radio" name="answerForGet"/>
    POOL
  </label>
    </ListItemText>
  </List>
  <button onClick={handleGetClick} className="button is-dark">GET</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
