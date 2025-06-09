import React from 'react';
import './NearbyEbikes.css';
import bolt_icon from './img/bolt.svg'

import {
    CARROLL_ST_AND_SIXTH_AVE_STATION_ID,
    CARROLL_ST_STATION_ID,
    EBIKE_API_URL,
    FIFTH_AVE_AND_THIRD_ST_STATION_ID,
    FIRST_ST_AND_SIXTH_AVE_STATION_ID,
    NEARBY_STATIONS,
    PRESIDENT_AVE_AND_FOURTH_AVE,
    REFRESH_INTERVAL_MS,
    UNION_ST_AND_FOURTH_AVE
} from "./constants";

type StationInformation = {
    station_label: string
    station_distance: number
    ebikes: number
}

type GBFSStationInformation = {
    num_ebikes_available: number
    station_id: string
}

function NearbyEBikes() {
    const [stationsInformation, setStationsInformation] = React.useState<StationInformation[]>([])
    const [lastUpdatedAt, setLastUpdatedAt] = React.useState(Date.now() / 1000)

    function parseEbikeData(response: any): {stationInformation: StationInformation[], lastUpdatedAt: number} {
        const station_data: GBFSStationInformation[] = response.data.stations
        const nearby_stations = station_data.filter(s => NEARBY_STATIONS.includes(s.station_id))
        const ebikeCountPerStation: Map<string, StationInformation> = new Map()
        nearby_stations.forEach(gbfs_station_data => {
            let station_name = ""
            let station_distance = 0.0
            // Note -- the distances aren't actual physical distances
            // They are just relatively ordered from how close they are from my apartment
            switch(gbfs_station_data.station_id) {
                case CARROLL_ST_STATION_ID:
                    station_name = "al di la"
                    station_distance = 1
                    break;
                case FIFTH_AVE_AND_THIRD_ST_STATION_ID:
                    station_name = "Playground"
                    station_distance = 2
                    break
                case PRESIDENT_AVE_AND_FOURTH_AVE:
                    station_name = "Blink Fitness"
                    station_distance = 3
                    break
                case UNION_ST_AND_FOURTH_AVE:
                    station_name = "Starbucks"
                    station_distance = 4
                    break
            }

            const info: StationInformation = {
                station_label: station_name,
                station_distance: station_distance,
                ebikes: gbfs_station_data.num_ebikes_available
            }

            ebikeCountPerStation.set(gbfs_station_data.station_id, info)
        })
        // last_updated is in seconds
        return {stationInformation: Array.from(ebikeCountPerStation.values()), lastUpdatedAt: response.last_updated}
    }

    React.useEffect(() => {
        async function fetchEBikeData() {
            try {
                const json_response = await fetch(EBIKE_API_URL)
                const response = await json_response.json()
                return parseEbikeData(response)
            } catch (error) {
                return {stationInformation: [], lastUpdatedAt: Date.now()}
            }
        }

        fetchEBikeData().then((gbfsData) => {
            setStationsInformation(gbfsData.stationInformation)
            setLastUpdatedAt(gbfsData.lastUpdatedAt)
        });

        const interval = setInterval(() => {
            fetchEBikeData().then((gbfsData) => {
                setStationsInformation(gbfsData.stationInformation)
                setLastUpdatedAt(gbfsData.lastUpdatedAt)
            });
        }, REFRESH_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [])

    const title = stationsInformation.length > 0 ? "Nearby E-Bikes" : "No E-Bikes Nearby"
    const titleClass = stationsInformation.length > 0 ? "NearbyEbikes-title" : "NearbyEbikes-title-noBikes"
    return (

        <div className={"NearbyEbikes-container"}>
            <div className={"NearbyEbikes-titleRow"}>
                <img className={"NearbyEbikes-logo"} src={bolt_icon} alt="Ebike" />
                <div className={titleClass}> {title} </div>
                <img className={"NearbyEbikes-logo"} src={bolt_icon} alt="Ebike" />

            </div>
            {
                stationsInformation.sort((a, b) => a.station_distance - b.station_distance).map(function(stationInfo) {
                return <div className={"NearbyEbikes-row"}>
                        <div className={"NearbyEbikes-location"}>{stationInfo.station_label}</div>
                        <div className={"NearbyEbikes-count"}>{stationInfo.ebikes}</div>
                    </div>
            })
            }
            <div className={"NearbyEbikes-footer"}>{`Last updated at ${new Date(lastUpdatedAt * 1000).toLocaleString()}`}</div>
        </div>

    )
}

export default NearbyEBikes;