import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L, { point } from "leaflet";
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

  const handlePostClick = () =>{console.log(nameState);

    if(nameState==null){
      document.getElementById("user_name").classList.add("is-danger");
      document.getElementById("name_helper").innerHTML="please enter a valid name";
      document.getElementById("name_helper").classList.remove("is-hidden");
    }

    else if(document.querySelector('input[name="answerForPost"]:checked')==null){
      document.getElementById("radio_helper").innerHTML="please check in your travel type";
      document.getElementById("radio_helper").classList.remove("is-hidden");
    }

    else if(dateState==null){
      document.getElementById("user_date").classList.add("is-danger");
      document.getElementById("date_helper").innerHTML="please enter your expected date of travel";
      document.getElementById("date_helper").classList.remove("is-hidden");
    }

    else if(DaysState==null){
      document.getElementById("user_wait_days").classList.add("is-danger");
      document.getElementById("days_helper").innerHTML="please enter the days you wish to wait";
      document.getElementById("days_helper").classList.remove("is-hidden");
    }

    else if(contactState==null){
      document.getElementById("user_contact").classList.add("is-danger");
      document.getElementById("contact_helper").innerHTML="please enter phone number";
      document.getElementById("contact_helper").classList.remove("is-hidden");
    }

    else if(rideCountState==null){
      document.getElementById("user_ride_count").classList.add("is-danger");
      document.getElementById("ride_count_helper").innerHTML="please enter number of seats available";
      document.getElementById("ride_count_helper").classList.remove("is-hidden");
    }

    else{

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
    fetch('http://18.116.114.239:8080/details/post',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBodyPost)
    }).then(res=>res.json()).then(data=>setResJsonPost(data));
    }
  }

  useEffect(()=>{
    if(resJsonPost!=null && resJsonPost.HTTP_STATUS_CODE==204){
      navigate('/user/details'+document.querySelector('input[name="answerForPost"]:checked').value,{state:[]})
    }
    else if(resJsonPost!=null){
      navigate('/user/details/'+document.querySelector('input[name="answerForPost"]:checked').value,{state:resJsonPost})
    }
  },[resJsonPost])

  const handleGetClick = () =>{

    fetch('http://18.116.114.239:8080/details/get?'+new URLSearchParams({
      pointA:JSON.stringify({lat:cord[0].x,lng:cord[0].y}),
      pointB:JSON.stringify({lat:cord[1].x,lng:cord[1].y}),
      selectedRadioButton:document.querySelector('input[name="answerForGet"]:checked').value
    })).then(res=>res.json())
       .then(data=>setResJsonGet(data));
  }

  useEffect(()=>{

    if(resJsonGet!=null && resJsonGet.HTTP_STATUS_CODE==204){console.log(document.querySelector('input[name="answerForGet"]:checked').value);
      navigate('/user/details/'+document.querySelector('input[name="answerForGet"]:checked').value,{state:[]})
    }
    else if(resJsonGet!=null){
      navigate('/user/details/'+document.querySelector('input[name="answerForGet"]:checked').value,{state:resJsonGet})
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
  <input id="user_name" className="input" onChange={(event)=>{
    setNameState(event.target.value)
    if(event.target.value==="" || event.target.value.trim()===""){
      document.getElementById("user_name").classList.add("is-danger");
      document.getElementById("name_helper").innerHTML="please enter a valid name";
      document.getElementById("name_helper").classList.remove("is-hidden");
    }
    else {
      document.getElementById("user_name").classList.remove("is-danger");
      document.getElementById("name_helper").classList.add("is-hidden");
    }
  }}/>
  <p id="name_helper"class="help is-danger is-hidden is-lowercase"></p>
  </ListItemText>
</List>
  <h3 className="heading has-text-weight-bold my-3">ARE YOU ????</h3>
    <ListItemText>
    <label className="radio has-text-weight-bold heading">
    <input className="mx-1" value="HOST" type="radio" onClick={()=>{document.getElementById("radio_helper").classList.add("is-hidden")}} name="answerForPost"/>
    HOST
  </label>
  <label className="radio has-text-weight-bold heading">
    <input className="mx-1" value="POOL" type="radio" onClick={()=>{document.getElementById("radio_helper").classList.add("is-hidden")}} name="answerForPost"/>
    POOL
  </label>
  <p id="radio_helper"class="help is-danger is-hidden is-lowercase"></p>
    </ListItemText>
  </List>
<List className="heading has-text-weight-bold">
WHAT IS THE DATE OF TRAVEL ???
  <ListItemText>
<input type="date" id="user_date"className="input" onChange={
  (event)=>{
    if(event.target.value===""){
      document.getElementById("user_date").classList.add("is-danger")
      document.getElementById("date_helper").classList.remove("is-hidden");
      document.getElementById("date_helper").innerHTML="please enter your expected date of travel";
    }
    else{
      setDateState(event.target.value);
    const input = new Date(event.target.value);
    const today = new Date();

    const total_time = input.getTime()-today.getTime();
    
    const total_days = total_time/(1000*3600*24);

    if(Math.floor(total_days)<0){
      document.getElementById("user_date").classList.add("is-danger")
      document.getElementById("date_helper").classList.remove("is-hidden");
      document.getElementById("date_helper").innerHTML="date cant be back dated";
    }

    else{
      document.getElementById("user_date").classList.remove("is-danger")
      document.getElementById("date_helper").classList.add("is-hidden");
    }
    }
  }
} />
<p id="date_helper"class="help is-danger is-hidden is-lowercase"></p>
  </ListItemText>
</List>
<List className="heading has-text-weight-bold">
HOW MANY DAYS CAN WAIT IN THE QUEUE !!!
  <ListItemText>
  <input type="number" id="user_wait_days"className="input" onChange={(event)=>{
    setDaysState(event.target.value);
    const input = new Date(document.getElementById("user_date").value);
    const today = new Date();

    const total_time = input.getTime()-today.getTime();
    
    const total_days = total_time/(1000*3600*24);

    console.log(event.target.value);

    if(event.target.value>Math.floor(total_days)+1 || event.target.value<=0){
      const last = Math.floor(total_days)+1;
      document.getElementById("days_helper").innerHTML="you can enter a number between [1,"+last+"]";
      document.getElementById("user_wait_days").classList.add("is-danger")
      document.getElementById("days_helper").classList.remove("is-hidden");
    }

    else{
      document.getElementById("user_wait_days").classList.remove("is-danger")
      document.getElementById("days_helper").classList.add("is-hidden");
    }
  }}/>
  <p id="days_helper"class="help is-danger is-hidden is-lowercase"></p>
  </ListItemText>
</List>
<List className="heading has-text-weight-bold">
  CONTACT INFORMATION
  <ListItemText>
    <input id="user_contact" type="text" className="input" placeholder="phone number" onChange={(event)=>{
      setContactState(event.target.value)
      const contact_regex = /^\d{10}$/gm;
      if(!contact_regex.test(event.target.value)){
        document.getElementById("user_contact").classList.add("is-danger");
        document.getElementById("contact_helper").innerHTML="please enter a valid phone number";
        document.getElementById("contact_helper").classList.remove("is-hidden");
      }
      else {
        document.getElementById("user_contact").classList.remove("is-danger");
        document.getElementById("contact_helper").classList.add("is-hidden");
      }
      
    }}/>
    <p id="contact_helper"class="help is-danger is-hidden is-lowercase"></p>
  </ListItemText>
</List>
<List className="heading has-text-weight-bold">
  HOW MANY CAN JOIN THE RIDE ???
  <ListItemText>
    <input id="user_ride_count" type="number" className="input" onChange={(event)=>{
      setRideCountState(event.target.value);
      if(event.target.value===""){
        document.getElementById("user_ride_count").classList.add("is-danger");
        document.getElementById("ride_count_helper").innerHTML="please enter number of seats available";
        document.getElementById("ride_count_helper").classList.remove("is-hidden");
      }
      else {
        document.getElementById("user_ride_count").classList.remove("is-danger");
        document.getElementById("ride_count_helper").classList.add("is-hidden");
      }
    }}/>
    <p id="ride_count_helper"class="help is-danger is-hidden is-lowercase"></p>
    </ListItemText>
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
