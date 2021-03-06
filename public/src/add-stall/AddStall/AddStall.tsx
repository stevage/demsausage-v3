import * as React from "react"
import styled from "styled-components"

// import { IElection, IStallLocationInfo } from "../../redux/modules/interfaces"
// import "./AddStallForm.css"

import AddStallFormContainer from "../AddStallForm/AddStallFormContainer"

export interface IProps {
    showNoActiveElections: boolean
    showWelcome: boolean
    showThankYou: boolean
    showForm: boolean
    onStallAdded: Function
}

const FormContainer = styled.div``

const FormSection = styled.div`
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
    margin-bottom: 15px;
`

const FormSectionHeader = styled.h2`
    margin-bottom: 0px;
`

const FormText = styled.p`
    margin-top: 20px;
`

class AddStall extends React.PureComponent<IProps, {}> {
    render() {
        const { showNoActiveElections, showWelcome, showThankYou, showForm, onStallAdded } = this.props

        return (
            <FormContainer>
                {showNoActiveElections && (
                    <FormSection>
                        <FormSectionHeader>There aren't any active elections at the moment</FormSectionHeader>
                        <FormText>
                            Thanks for your interest in submitting a stall, but there aren't any elections coming up that we're planning to
                            cover. If you know of an election that you think we should cover, please get in touch with us at{" "}
                            <a href="mailto:ausdemocracysausage@gmail.com">ausdemocracysausage@gmail.com</a> and we'll consider adding it.
                        </FormText>
                    </FormSection>
                )}

                {showWelcome && (
                    <FormSection>
                        <FormSectionHeader>Add your sausage sizzle or cake stall</FormSectionHeader>
                        <FormText>
                            Please complete the form below to add your stall to the map. Please do not submit entries that are offensive,
                            political or do not relate to an election day stall. Please also make sure that you have authorisation to run
                            your fundraising event at the polling place. All entries are moderated and subject to approval.<br />
                            <br />
                            Having trouble submitting a stall? Email us at{" "}
                            <a href="mailto:ausdemocracysausage@gmail.com">ausdemocracysausage@gmail.com</a>!
                        </FormText>
                    </FormSection>
                )}

                {showThankYou && (
                    <FormSection>
                        <FormSectionHeader>Thank you</FormSectionHeader>
                        <FormText>
                            Thanks for letting us know about your stall! We'll let you know once it's approved and it's appearing on the
                            map.
                        </FormText>
                    </FormSection>
                )}

                {showForm && <AddStallFormContainer onStallAdded={onStallAdded} />}
            </FormContainer>
        )
    }
}

export default AddStall
