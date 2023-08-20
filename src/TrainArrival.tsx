import n_logo from './img/n_logo.png'
import r_logo from './img/r_logo.png'
import './TrainArrival.css';

interface Props {
    subway_line: string
    display_string: string
}
function TrainArrival(props: Props) {
    const logo = props.subway_line === "N" ? n_logo : r_logo
    return (
        <div className={"trainArrival-row"}>
            <img className={"trainArrival-logo"} src={logo} alt="N Logo"/>
            <b>{props.display_string}</b>
        </div>
    )
}

export default TrainArrival