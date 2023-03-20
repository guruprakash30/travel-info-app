import UserBox from "./userBox";
import { useLocation } from "react-router-dom"

const UserDetails = () => {

    const location = useLocation();
    
    return (<div className="container">
  <div className="my-5">
<h3 className="heading has-text-weight-bold">HOST DETAILS</h3>
<UserBox data={location.state.filter(traveller=>traveller.travelType=="HOST")}></UserBox>
</div>
<div className="my-5">
<h3 className="heading has-text-weight-bold">POOL DETAILS</h3>
<UserBox data={location.state.filter(traveller=>traveller.travelType=="POOL")}></UserBox>
</div>
    </div>);
}
 
export default UserDetails;