import { useEffect, useState } from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import useFetch from './useFetch';
import MapCurrent from './Map';
import { useNavigate } from 'react-router-dom';

const App = () => {
        const [from,setFrom] = useState('');

  const [to,setTo] = useState('');

  const navigate = useNavigate();

  const [selectedFrom,setSelectedFrom] = useState(null);

  const [selectedTo,setSelectedTo] = useState(null);

  const url = 'https://nominatim.openstreetmap.org/search?';

  const [params,setParams] = useState({
    q:'',
    format:"json",
    addressdetails:'1'
  });

  const {setQuery,data,setData} = useFetch(url,params,setParams);

  useEffect(()=>{

    if(from!==''){
      setQuery(from);
    }

    else{
      setData(null);
    }

  },[from])

  useEffect(()=>{

    if(to!==''){
      setQuery(to);
    }

    else{
      setData(null);
    }
  },[to])

  const handleClick = () =>{

    const cord = [
      {
        x:selectedFrom.lat,
        y:selectedFrom.lon,
        f:from
      },
      {
        x:selectedTo.lat,
        y:selectedTo.lon,
        t:to
      }
    ]

    const param = JSON.stringify(cord);
    navigate('/get/'+param);
  }
  return (
    <>
    <div className="columns">
      <div className="column is-8"><MapCurrent/></div>
      <div className="column is-4">
      <div className="m-2">
      <div className="field">
        <p className="control has-icons-left">
          <input type="text" className="input" value={from} onChange={(event)=>setFrom(event.target.value)}/>
          <span className="icon is-small is-left"><i className="fa-solid fa-location-arrow"></i></span>
        </p>
      </div>
      </div>
      <span className="icon ml-2"><i className="fa-solid fa-ellipsis-vertical"></i></span>
      <div className="m-2">
      <div className="field">
        <p className="control has-icons-left">
          <input type="text" className="input" value={to} onChange={(event)=>setTo(event.target.value)}/>
          <span className="icon is-small is-left"><i className="fa-solid fa-location-dot"></i></span>
        </p>
      </div>
      </div>
      <div className="m-2"><button className="button is-light is-small" onClick={handleClick}>LOCATE</button></div>
      <div className="my-4"><Divider/></div>
      <List component="nav" aria-label="secondary mailbox folders">
        {data && data.map((item)=>(
          <ListItem button onClick={()=>{
            if(from!=='' && to===''){
              setSelectedFrom(item);
              setFrom(item.display_name);
              setData(null);
            }
            else{
              setSelectedTo(item);
              setTo(item.display_name);
              setData(null);
            }
          }}>
          <ListItemIcon><span className="icon"><i class="fa-solid fa-map-pin"></i></span></ListItemIcon>
          <ListItemText primary={item.display_name}/>
        </ListItem>
        ))}
      </List>
      </div>
    </div>
    </>
  );

}
 
export default App;