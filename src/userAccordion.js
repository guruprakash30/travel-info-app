import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { useState } from 'react';
import { Grid } from '@material-ui/core';
import {ExpandMore,NearMe,LocationOn,Person,CalendarToday,PhoneInTalk,GroupAdd} from '@material-ui/icons';



export default function UserAccordion({data}) {

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
    {data.length>0 && data.map((traveller,count)=>{
    count+=1;
    return (
      <div key={count} className="my-5 container">
       <Accordion expanded={expanded === 'panel'+count} onChange={handleChange('panel'+count)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
                <Grid item xs={2}>
                    <h3 className="heading is-size-3">{"#"+count}</h3>
                </Grid>
                <Grid item container xs={5} direction="row" alignItems='center' spacing={1}>
  <Grid item>
    <NearMe/>
  </Grid>
  <Grid item>
    <h3 className="heading">{traveller.from}</h3>
  </Grid>
</Grid>
<Grid item container xs={5} direction="row" alignItems='center' spacing={1}>
  <Grid item>
    <LocationOn/>
  </Grid>
  <Grid item>
    <h3 className="heading">{traveller.to}</h3>
  </Grid>
</Grid>
        </AccordionSummary>
        <AccordionDetails>
        <Grid item container xs={4} direction="row" alignItems='center' spacing={1}>
  <Grid item>
  <Person/>
  </Grid>
  <Grid item>
    <h3 className="heading">{traveller.name}</h3>
  </Grid>
</Grid>
<Grid item container xs={4} direction="row" alignItems='center' spacing={1}>
  <Grid item>
  <PhoneInTalk/>
  </Grid>
  <Grid item>
    <h3 className="heading">{traveller.phoneNumber}</h3>
  </Grid>
</Grid>
<Grid item container xs={4} direction="row" alignItems='center' spacing={1}>
  <Grid item>
  <CalendarToday/>
  </Grid>
  <Grid item>
    <h3 className="heading">{traveller.date}</h3>
  </Grid>
</Grid>
<Grid item container xs={4} direction="row" alignItems='center' spacing={1}>
  <Grid item>
  <GroupAdd/>
  </Grid>
  <Grid item>
    <h3 className="heading">{traveller.rideCount}</h3>
  </Grid>
</Grid>
        </AccordionDetails>
      </Accordion>
     </div>
    )

})}
    {data.length==0 && <h6 className="heading">NO TRAVELLERS BETWEEN THE SELECTED ROUTE</h6>}
    </>
      );
}
