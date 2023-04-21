import UserAccordion from "./userAccordion";
import { useLocation, useParams } from "react-router-dom"

const UserDetails = () => {

    const location = useLocation();

    const {travelType} = useParams();

    console.log(travelType);
    
    return (<div className="container">
  <div className="my-5 box has-shadow">
<h3 className="heading has-text-weight-bold">HOST DETAILS</h3>
<UserAccordion data={location.state.filter(traveller=>traveller.travelType==="HOST")}></UserAccordion>
</div>
{travelType==="HOST" && <div className="my-5 box has-shadow">
<h3 className="heading has-text-weight-bold">POOL DETAILS</h3>
<UserAccordion data={location.state.filter(traveller=>traveller.travelType==="POOL")}></UserAccordion>
</div>}
    </div>);
}
 
export default UserDetails;