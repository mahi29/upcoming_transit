import React from 'react';
import './App.css';
import NearbyEBikes from "./NearbyEBikes";
import UpcomingTrains from "./UpcomingTrains";
import UpcomingBuses from "./UpcomingBuses";

function App() {
  return (
      <div>
        <div className={"App-body"}>
          <div className={"App-upcomingTrains"}>
            <UpcomingTrains />
          </div>
            <div className={"App-upcomingBuses"}>
                <UpcomingBuses />
            </div>
          <div className={"App-nearbyEbikes"}>
            <NearbyEBikes/>
          </div>
        </div>
      </div>

  );
}

export default App;
