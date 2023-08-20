import React from 'react';
import './App.css';
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import {JSX} from 'react/jsx-runtime';
import {UNION_ST_STATION_ID, YELLOW_TRAIN_API_URL, API_KEY} from "./constants";
import {maybeGetFormattedDurationString} from "./helpers";
import TrainArrival from "./TrainArrival";

type UpcomingTrain = { route: string, arrivalTime: number }
type TrainsAtStation = UpcomingTrain[]

function App() {

  const [upcomingTrains, setUpcomingTrains] = React.useState<TrainsAtStation>([])
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState(Date.now())

  function parseData(feed: GtfsRealtimeBindings.transit_realtime.FeedMessage) {
    const matchingTrains: TrainsAtStation = [];
    feed.entity.forEach((entity) => {
      if (!entity.tripUpdate) {
        return;
      }
      if (!entity.tripUpdate.stopTimeUpdate) {
        return;
      }

      const routeId = entity.tripUpdate.trip.routeId
      if (!routeId) {
        return;
      }

      entity.tripUpdate.stopTimeUpdate.forEach((stopTimeUpdate) => {
        if (stopTimeUpdate.stopId === UNION_ST_STATION_ID) {
          const arrival = stopTimeUpdate.arrival?.time
          if (!arrival) {
            return;
          }
          // @ts-ignore
          matchingTrains.push({route: routeId, arrivalTime: arrival})
        }
      })
    });

    matchingTrains.sort((a, b) => a.arrivalTime - b.arrivalTime)
    return matchingTrains
  }

  async function getYellowTrainData(): Promise<UpcomingTrain[]> {
    try {
      const response = await fetch(YELLOW_TRAIN_API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      if (!response.ok) {
        process.exit(1);
      }
      const buffer = await response.arrayBuffer();
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
          new Uint8Array(buffer)
      );
      const parsedData = parseData(feed)
      return Array.from(parsedData.values())
    } catch (error) {
      console.log(error);
      return []
    }
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        const updates = await getYellowTrainData();
        setUpcomingTrains(updates);
        setLastUpdatedAt(Date.now())
      })();
    }, 60000);

    // this now gets called when the component unmounts
    return () => {
      clearInterval(interval)
    };
  }, []);


  const tableRows: JSX.Element[] = []
  upcomingTrains.forEach(function (upcomingTrain) {
    const timeRemaining = maybeGetFormattedDurationString(upcomingTrain.arrivalTime)
    if (!timeRemaining) {
      return;
    }

    tableRows.push(<tr><td><TrainArrival subway_line={upcomingTrain.route} display_string={timeRemaining} /></td></tr>)
  })


  return (
      <div>
        <b>{new Date(lastUpdatedAt).toLocaleString()}</b>
        <table className={"App-table"}>
          <tr>
            <th>
              Upcoming Trains
            </th>
            <th>
              Upcoming Buses
            </th>
          </tr>
          <tbody>
          <tr>
            {tableRows}
          </tr>
          </tbody>
        </table>
      </div>
  );
}

export default App;
