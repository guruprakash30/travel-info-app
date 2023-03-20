const UserBox = ({data}) => {

    return (
        <>
        {data.length>0 && data.map((traveller)=>
        <div className="box has-shadow">
          <div>
          <span className="icon-text">
        <span className="icon">
        <i className="fa-solid fa-user"></i>
        </span>
        <span>{traveller.name}</span>
      </span>
          </div>
      <div>
      <span className="icon-text">
        <span className="icon">
        <i className="fa-solid fa-location-arrow"></i>
        </span>
        <span>{traveller.from}</span>
      </span>
      </div>
      <div>
      <span className="icon-text">
        <span className="icon">
        <i className="fa-solid fa-location-dot"></i>
        </span>
        <span>{traveller.to}</span>
      </span>
      </div>
      <div>
      <span className="icon-text">
        <span className="icon">
        <i className="fa-solid fa-clock"></i>
        </span>
        <span>{traveller.date}</span>
      </span>
      </div>
      <div>
      <span className="icon-text">
        <span className="icon">
        <i className="fa-solid fa-phone"></i>
        </span>
        <span>{traveller.phoneNumber}</span>
      </span>
      </div>
      <div>
      <span className="icon-text">
        <span className="icon">
        <i className="fa-solid fa-plus"></i>
        </span>
        <span>{traveller.rideCount}</span>
      </span>
      </div>
        </div>
        )}
        {data.length==0 && <h6 className="heading">NO TRAVELLERS BETWEEN THE SELECTED ROUTE</h6>}
        </>
        );
}
 
export default UserBox;