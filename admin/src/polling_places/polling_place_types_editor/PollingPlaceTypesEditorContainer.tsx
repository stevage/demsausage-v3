import * as React from "react"
import { connect } from "react-redux"

import PollingPlaceTypesEditor from "./PollingPlaceTypesEditor"
import { IStore, IElection, IPollingPlace } from "../../redux/modules/interfaces"
import { fetchAllPollingPlaces, updatePollingPlace } from "../../redux/modules/polling_places"

export interface IStoreProps {
  election: IElection
  pollingPlaces: Array<IPollingPlace>
  pollingPlaceTypes: Array<string>
}

export interface IDispatchProps {
  fetchInitialState: Function
  updatePollingPlaceType: Function
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

  render() {
    const { pollingPlaces, pollingPlaceTypes, election, updatePollingPlaceType } = this.props

    return (
      <PollingPlaceTypesEditor
        pollingPlaces={pollingPlaces}
        pollingPlaceTypes={pollingPlaceTypes}
        onChangeType={(value: string, pollingPlace: IPollingPlace) => {
          updatePollingPlaceType(election, pollingPlace, value)
        }}
      />
    )
  }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps): IStoreProps => {
  const { elections, polling_places } = state

  let election: IElection | null = null
  if (ownProps.params.electionIdentifier !== null) {
    // Sorry.
    const filteredElection: Array<string> = Object.keys(elections.elections).filter(
      (key: string) => elections.elections[key].id === parseInt(ownProps.params.electionIdentifier, 10)
    )
    election = elections.elections[filteredElection[0]]
  }

  return {
    election: election!,
    pollingPlaces: polling_places.by_election[election!.id] || [],
    pollingPlaceTypes: polling_places.types,
  }
}

const mapDispatchToProps = (dispatch: Function): IDispatchProps => {
  return {
    fetchInitialState: (election: IElection) => {
      dispatch(fetchAllPollingPlaces(election))
    },
    updatePollingPlaceType: (election: IElection, pollingPlace: IPollingPlace, newType: string) => {
      dispatch(updatePollingPlace(election, pollingPlace, { polling_place_type: newType }))
    },
  }
}

const PollingPlaceTypesEditorContainerWrapped = connect(mapStateToProps, mapDispatchToProps)(PollingPlaceTypesEditorContainer)

export default PollingPlaceTypesEditorContainerWrapped
