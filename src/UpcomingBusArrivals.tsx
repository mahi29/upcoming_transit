import React from 'react';
import './UpcomingBusArrivals.css';
import TrainArrival from "./TrainArrival";
import {BUS_API_BASE_URL} from "./constants";

function UpcomingBusArrivals() {
   const [upcomingArrivals, setUpcomingArrivals] = React.useState<number[]>([])
   function parseBusData(response: any) {
      const lastUpdatedAt = response.Siri.ServiceDelivery.ResponseTimestamp
      const upcomingArrivalTimes: number[] = []
      const upcomingStops = response.Siri.ServiceDelivery.StopMonitoringDelivery
      upcomingStops.forEach(function (upcomingStop: any) {
         const x = upcomingStop.MonitoredStopVisit
         x.forEach(function (y: any) {
            const vehicleDataForStop = y.MonitoredVehicleJourney
            if (vehicleDataForStop.PublishedLineName !== "B63") {
               return;
            }
            const expectedArrivalTime = vehicleDataForStop.MonitoredCall.ExpectedArrivalTime
            upcomingArrivalTimes.push(expectedArrivalTime)
         })
      })

      return {lastUpdatedAt, upcomingArrivalTimes}
   }
   async function fetchB63Data() {
      try {
         const json_response = await fetch(BUS_API_BASE_URL)
         const response = await json_response.json()
         return parseBusData(response)
      } catch (error) {
         console.log(error)
         return {}
      }
   }
   React.useEffect(() => {
      const interval = setInterval(() => {
         (async () => {
            setUpcomingArrivals([])

         })();
      }, 30000);

      return () => {
         clearInterval(interval)
      };
   })
   return (
       <div>
          {upcomingArrivals.map(function (upcomingArrival) {
             return <TrainArrival subway_line={"B63"} minutes_to_arrival={upcomingArrival} />
          })}
       </div>
   )
}

export default UpcomingBusArrivals