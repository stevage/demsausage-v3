import * as React from "react"
import { connect } from "react-redux"
import { browserHistory } from "react-router"

import PollingPlaceTypesEditor from "./PollingPlaceTypesEditor"
import EmptyState from "../../shared/empty_state/EmptyState"
import { IStore, IElection, IPollingPlace } from "../../redux/modules/interfaces"
import { fetchAllPollingPlaces, updatePollingPlace } from "../../redux/modules/polling_places"

import CommunicationLocationOff from "material-ui/svg-icons/communication/location-off"

export interface IStoreProps {
    election: IElection
    pollingPlaces: Array<IPollingPlace>
    pollingPlaceTypes: Array<string>
}

export interface IDispatchProps {
    fetchInitialState: Function
    updatePollingPlaceType: Function
    onElectionChanged: Function
}

export interface IStateProps {}

interface IRouteProps {
    electionIdentifier: string
}

interface IOwnProps {
    params: IRouteProps
}

export class PollingPlaceTypesEditorContainer extends React.PureComponent<IStoreProps & IDispatchProps, IStateProps> {
    componentDidMount() {
        const { fetchInitialState, election } = this.props
        fetchInitialState(election)
    }

    componentWillReceiveProps(nextProps: IStoreProps & IDispatchProps) {
        const { fetchInitialState, election } = this.props
        if (election.id !== nextProps.election.id) {
            fetchInitialState(nextProps.election)
        }
    }

    render() {
        const { pollingPlaces, pollingPlaceTypes, election, updatePollingPlaceType, onElectionChanged } = this.props

        if (election.db_table_name === "") {
            return (
                <EmptyState
                    message={
                        <div>
                            We don't have any polling<br />places for this election yet :(
                        </div>
                    }
                    icon={<CommunicationLocationOff />}
                />
            )
        }

        return (
            <PollingPlaceTypesEditor
                pollingPlaces={pollingPlaces}
                pollingPlaceTypes={pollingPlaceTypes}
                onChangeType={(value: string, pollingPlace: IPollingPlace) => {
                    updatePollingPlaceType(election, pollingPlace, value)
                }}
                onElectionChanged={onElectionChanged}
            />
        )
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps): IStoreProps => {
    const { elections, polling_places } = state

    return {
        election: elections.elections.find((election: IElection) => election.id === parseInt(ownProps.params.electionIdentifier, 10))!,
        pollingPlaces: polling_places.by_election[ownProps.params.electionIdentifier] || [],
        pollingPlaceTypes: polling_places.types,
    }
}

const mapDispatchToProps = (dispatch: Function): IDispatchProps => {
    return {
        fetchInitialState: (election: IElection) => {
            if (election.db_table_name !== "") {
                dispatch(fetchAllPollingPlaces(election))
            }
        },
        updatePollingPlaceType: (election: IElection, pollingPlace: IPollingPlace, newType: string) => {
            dispatch(updatePollingPlace(election, pollingPlace, { polling_place_type: newType }))
        },
        onElectionChanged: (electionId: number) => {
            browserHistory.push(`/election/${electionId}/polling_place_types/`)
        },
    }
}

const PollingPlaceTypesEditorContainerWrapped = connect(mapStateToProps, mapDispatchToProps)(PollingPlaceTypesEditorContainer)

export default PollingPlaceTypesEditorContainerWrapped
