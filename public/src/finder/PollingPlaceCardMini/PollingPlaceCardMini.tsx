import * as React from "react"
import styled from "styled-components"
// import { Link, browserHistory } from "react-router"
// import "./PollingPlaceCardMini.css"
import { IPollingPlaceSearchResult } from "../../redux/modules/interfaces"
import { pollingPlaceHasReports, getSausageChanceDescription } from "../../redux/modules/polling_places"

import Paper from "material-ui/Paper"
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import { ListItem } from "material-ui/List"
import Avatar from "material-ui/Avatar"
// import Divider from "material-ui/Divider"
// import Subheader from 'material-ui/Subheader';
import { MapsNavigation, AlertWarning, EditorInsertChart, MapsAddLocation } from "material-ui/svg-icons"
import { grey500, yellow600, blue500 } from "material-ui/styles/colors"

import SausageIcon from "../../icons/sausage"
import CakeIcon from "../../icons/cake"
import VegoIcon from "../../icons/vego"
import RedCrossofShameIcon from "../../icons/red-cross-of-shame"
import HalalIcon from "../../icons/halal"
import CoffeeIcon from "../../icons/coffee"
import BaconandEggsIcon from "../../icons/bacon-and-eggs"

const FlexboxContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
`

const FlexboxIcons = styled.div`
    flex-grow: 1;
    svg {
        padding-left: 5px;
        padding-right: 5px;
    }
`

const FlexboxDistance = styled(FlatButton)`
    color: ${grey500} !important;
`

const HasOtherNoms = styled.div``

const RunOutWarning = styled(ListItem)`
    margin-bottom: 10px !important;
`

const Division = styled.div`
    color: ${grey500};
`

const ChanceOfSausage = styled(ListItem)`
    color: ${grey500};
    .sausageChance {
        color: red;
    }
`

export interface IProps {
    pollingPlace: IPollingPlaceSearchResult
}

class PollingPlaceCardMini extends React.PureComponent<IProps, {}> {
    render() {
        const { pollingPlace } = this.props
        // console.log(pollingPlace)

        return (
            <Paper>
                <Card>
                    <CardHeader
                        title={pollingPlace.polling_place_name}
                        subtitle={pollingPlace.address}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />
                    {/* <CardMedia overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}>
                    <img src="images/nature-600-337.jpg" alt="" />
                </CardMedia> */}
                    {/* <CardTitle title={pollingPlace.address} subtitle={pollingPlace.premises} /> */}
                    <CardText>
                        <FlexboxContainer>
                            <FlexboxIcons>
                                {pollingPlace.has_bbq && <SausageIcon />}
                                {pollingPlace.has_caek && <CakeIcon />}
                                {"has_vego" in pollingPlace.has_other && <VegoIcon />}
                                {pollingPlace.has_nothing && <RedCrossofShameIcon />}
                                {"has_halal" in pollingPlace.has_other && <HalalIcon />}
                                {"has_coffee" in pollingPlace.has_other && <CoffeeIcon />}
                                {"has_baconandeggs" in pollingPlace.has_other && <BaconandEggsIcon />}
                            </FlexboxIcons>
                            <FlexboxDistance
                                label={`${(pollingPlace.distance_metres / 1000).toFixed(2)}km`}
                                icon={<MapsNavigation color={grey500} />}
                            />
                        </FlexboxContainer>
                        {"has_freetext" in pollingPlace.has_other && (
                            <HasOtherNoms>`This booth also has: ${pollingPlace.has_other.has_freetext}`</HasOtherNoms>
                        )}
                        {pollingPlace.has_run_out && (
                            <RunOutWarning
                                secondaryText={"We've had reports that the stalls at this polling booth have run out of food."}
                                secondaryTextLines={2}
                                leftAvatar={<Avatar icon={<AlertWarning />} backgroundColor={yellow600} />}
                            />
                        )}
                        {pollingPlaceHasReports(pollingPlace) === false && (
                            <ChanceOfSausage
                                primaryText={"We don't have any reports for this booth yet."}
                                secondaryText={`Based on past elections this booth has a ${getSausageChanceDescription(
                                    pollingPlace
                                )} chance of having food.`}
                                secondaryTextLines={2}
                                leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={blue500} />}
                            />
                        )}
                        {pollingPlace.division !== "" && <Division>Division(s): {pollingPlace.division}</Division>}
                    </CardText>
                    <CardText expandable={true}>Nothing to see here. Move along, move along.</CardText>
                    <CardActions>
                        <RaisedButton primary={true} label="Report" icon={<MapsAddLocation />} />
                    </CardActions>
                </Card>
            </Paper>
        )
    }
}

export default PollingPlaceCardMini
