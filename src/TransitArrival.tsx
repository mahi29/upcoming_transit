import d_logo from './img/d_logo.svg'
import f_logo from './img/d_logo.svg'
import n_logo from './img/n_logo.svg'
import r_logo from './img/r_logo.svg'
import default_mta_logo from './img/default_mta_logo.svg'

import './TransitArrival.css';
import {getDuration} from "./helpers";

interface Props {
    transitRoute: string
    arrivalTime: number
}
function TransitArrival(props: Props) {
    const minutesLeft = getDuration(props.arrivalTime * 1000)

    if (minutesLeft <= 0 || minutesLeft > 30) {
        return null;
    }

    function getAbsoluteArrivalTime() {
        const absoluteTime = new Date(props.arrivalTime*1000)
        const hours = absoluteTime.getHours().toString().padStart(2, '0');
        const minutes = absoluteTime.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function getLogo(transit_route: string) {
        switch (transit_route) {
            case "N":
                return n_logo
            case "R":
                return r_logo
            case "F":
                return f_logo
            case "D":
                return d_logo
            default:
                return default_mta_logo
        }
    }

    function getDepartureLimits(transit_route: string) {
        switch (transit_route) {
            case "Bus":
                return {"warning": 4, "too_late": 2}
            default:
                return {"warning": 10, "too_late": 6}
        }
    }
    const logo = getLogo(props.transitRoute)
    let cssClassForDisplay = "transitArrival-displayString"
    const departureLimits = getDepartureLimits(props.transitRoute)
    if (minutesLeft < departureLimits.too_late) {
        cssClassForDisplay += " transitArrival-tooLate"
    } else if (minutesLeft < departureLimits.warning) {
        cssClassForDisplay = " transitArrival-warning"
    }
    return (
        <div className={"transitArrival-row"}>
            <img className={"transitArrival-logo"} src={logo} alt="Trasit Route Logo"/>
            <div className={cssClassForDisplay}>{`${minutesLeft} min`}</div>
            <div className={"transitArrival-absoluteArrival"}>{`(${getAbsoluteArrivalTime()})`}</div>
        </div>
    )
}

export default TransitArrival