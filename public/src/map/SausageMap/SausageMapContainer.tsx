import * as React from "react"
import { connect } from "react-redux"
import { browserHistory } from "react-router"

import SausageMap from "./SausageMap"
import { IStore, IElection, IMapPollingPlace, IPollingPlace, ePollingPlaceFinderInit } from "../../redux/modules/interfaces"

import { fetchPollingPlacesByIds } from "../../redux/modules/polling_places"
import { setPollingPlaceFinderMode } from "../../redux/modules/app"
import { gaTrack } from "../../shared/analytics/GoogleAnalytics"

export interface IStoreProps {
    elections: Array<IElection>
    currentElection: IElection
    defaultElection: IElection
}

export interface IDispatchProps {
    fetchQueriedPollingPlaces: Function
    onOpenFinderForAddressSearch: Function
    onOpenFinderForGeolocation: Function
}

export interface IStateProps {
    queriedPollingPlaces: Array<IPollingPlace>
    hasSeenElectionAnnouncement: boolean
}

interface IRouteProps {
    electionName: string
}

interface IOwnProps {
    params: IRouteProps
}

export class SausageMapContainer extends React.Component<IStoreProps & IDispatchProps & IOwnProps, IStateProps> {
    static muiName = "SausageMapContainer"
    static pageTitle = "Democracy Sausage"
    static pageBaseURL = ""

    constructor(props: any) {
        super(props)

        this.state = { queriedPollingPlaces: [], hasSeenElectionAnnouncement: false }

        this.onSetQueriedPollingPlaces = this.onSetQueriedPollingPlaces.bind(this)
        this.onClearQueriedPollingPlaces = this.onClearQueriedPollingPlaces.bind(this)
        this.onElectionAnnounceClose = this.onElectionAnnounceClose.bind(this)
    }

    onSetQueriedPollingPlaces(pollingPlaces: Array<IPollingPlace>) {
        this.setState(Object.assign(this.state, { queriedPollingPlaces: pollingPlaces }))
    }

    onClearQueriedPollingPlaces() {
        this.setState(Object.assign(this.state, { queriedPollingPlaces: [] }))
    }

    onElectionAnnounceClose() {
        this.setState(Object.assign(this.state, { hasSeenElectionAnnouncement: true }))
    }

    render() {
        const { currentElection, fetchQueriedPollingPlaces, onOpenFinderForAddressSearch, onOpenFinderForGeolocation } = this.props
        const { queriedPollingPlaces, hasSeenElectionAnnouncement } = this.state

        return (
            <SausageMap
                currentElection={currentElection}
                queriedPollingPlaces={queriedPollingPlaces}
                hasSeenElectionAnnouncement={hasSeenElectionAnnouncement}
                onQueryMap={async (features: Array<IMapPollingPlace>) => {
                    const pollingPlaceIds: Array<number> = features.map((feature: IMapPollingPlace) => feature.id)
                    const pollingPlaces = await fetchQueriedPollingPlaces(currentElection, pollingPlaceIds)
                    this.onSetQueriedPollingPlaces(pollingPlaces)
                }}
                onCloseQueryMapDialog={() => this.onClearQueriedPollingPlaces()}
                onElectionAnnounceClose={() => this.onElectionAnnounceClose()}
                onOpenFinderForAddressSearch={onOpenFinderForAddressSearch}
                onOpenFinderForGeolocation={onOpenFinderForGeolocation}
            />
        )
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps): IStoreProps => {
    const { elections } = state

    return {
        elections: elections.elections,
        currentElection: elections.elections.find((election: IElection) => election.id === elections.current_election_id)!,
        defaultElection: elections.elections.find((election: IElection) => election.id === elections.default_election_id)!,
    }
}

const mapDispatchToProps = (dispatch: Function): IDispatchProps => {
    return {
        fetchQueriedPollingPlaces: async (election: IElection, pollingPlaceIds: Array<number>) => {
            gaTrack.event({
                category: "Sausage",
                action: "SausageMapContainer",
                type: "fetchQueriedPollingPlacesIds",
                value: pollingPlaceIds.length,
            })
            const results = await dispatch(fetchPollingPlacesByIds(election, pollingPlaceIds))
            gaTrack.event({
                category: "Sausage",
                action: "SausageMapContainer",
                type: "fetchQueriedPollingPlacesResults",
                value: results.length,
            })
            return results
        },
        onOpenFinderForAddressSearch() {
            gaTrack.event({
                category: "Sausage",
                action: "SausageMapContainer",
                type: "onOpenFinderForAddressSearch",
            })
            dispatch(setPollingPlaceFinderMode(ePollingPlaceFinderInit.FOCUS_INPUT))
            browserHistory.push("/search")
        },
        onOpenFinderForGeolocation() {
            gaTrack.event({
                category: "Sausage",
                action: "SausageMapContainer",
                type: "onOpenFinderForGeolocation",
            })
            dispatch(setPollingPlaceFinderMode(ePollingPlaceFinderInit.GEOLOCATION))
            browserHistory.push("/search")
        },
    }
}

const SausageMapContainerWrapped = connect(mapStateToProps, mapDispatchToProps)(SausageMapContainer)

export default SausageMapContainerWrapped
