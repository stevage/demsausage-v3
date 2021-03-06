import * as React from "react"
import styled from "styled-components"

import { Field, reduxForm } from "redux-form"
import { IElection, IPollingPlace } from "../../redux/modules/interfaces"
// import "./PollingPlaceForm.css"

import { Card, CardTitle, CardText, CardActions } from "material-ui/Card"
import { grey100 } from "material-ui/styles/colors"
import { TextField, Toggle, SelectField } from "redux-form-material-ui"
import MenuItem from "material-ui/MenuItem"
import Divider from "material-ui/Divider"
import RaisedButton from "material-ui/RaisedButton"
import { List, ListItem } from "material-ui/List"
import Avatar from "material-ui/Avatar"
import { AlertWarning } from "material-ui/svg-icons"
import { blue500 } from "material-ui/styles/colors"
import { ContentBlock } from "material-ui/svg-icons"

import SausageIcon from "../../icons/sausage"
import CakeIcon from "../../icons/cake"
import VegoIcon from "../../icons/vego"
import HalalIcon from "../../icons/halal"
import CoffeeIcon from "../../icons/coffee"
import BaconandEggsIcon from "../../icons/bacon-and-eggs"
import RedCrossofShameIcon from "../../icons/red-cross-of-shame"
import { yellow700, grey500 } from "material-ui/styles/colors"

export interface IProps {
    election: IElection
    pollingPlace: IPollingPlace
    stallWasMerged: boolean
    pollingPlaceTypes: Array<string>
    onSubmit: any
    onSaveForm: any

    // From redux-form
    initialValues: any
    handleSubmit: any
    isDirty: any
}

// Work around TypeScript issues with redux-form. There's a bunch of issues logged in DefinitelyTyped's issue tracker.
class CustomField extends React.Component<any, any> {
    render(): any {
        return <Field autoComplete={"off"} {...this.props} />
    }
}

class CustomTextField extends React.Component<any, any> {
    render(): any {
        const { hintText, name, ...rest } = this.props

        return (
            <div>
                <Field name={name} {...rest} />
                <div style={{ color: grey500, fontSize: 12 }}>{hintText}</div>
            </div>
        )
    }
}

class DeliciousnessToggle extends React.Component<any, any> {
    render(): any {
        return <CustomField component={Toggle} thumbStyle={{ backgroundColor: grey100 }} {...this.props} />
    }
}

const FormCardTitle = styled(CardTitle)`
    padding-bottom: 0px !important;
`

const FormCardText = styled(CardText)`
    padding-top: 0px !important;
`

const HiddenButton = styled.button`
    display: none;
`

class PollingPlaceForm extends React.PureComponent<IProps, {}> {
    render() {
        const { stallWasMerged, pollingPlaceTypes, onSaveForm, handleSubmit, onSubmit } = this.props

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                {stallWasMerged && (
                    <ListItem
                        leftAvatar={<Avatar icon={<AlertWarning />} backgroundColor={blue500} />}
                        primaryText={"Stall information has already been automatically populated for you"}
                        secondaryText={
                            "This polling place had no reports yet, so just double check everything " + "and hit 'Save' if it's all OK."
                        }
                        secondaryTextLines={2}
                        disabled={true}
                    />
                )}

                <Card>
                    <FormCardTitle title={"Deliciousness"} />
                    <FormCardText>
                        <List>
                            <ListItem
                                primaryText="Is there a sausage sizzle?"
                                leftIcon={<SausageIcon />}
                                rightToggle={<DeliciousnessToggle name="has_bbq" />}
                            />
                            <ListItem
                                primaryText="Is there a cake stall?"
                                leftIcon={<CakeIcon />}
                                rightToggle={<DeliciousnessToggle name="has_caek" />}
                            />
                            <ListItem
                                primaryText="Are there vegetarian options?"
                                leftIcon={<VegoIcon />}
                                rightToggle={<DeliciousnessToggle name="has_vego" />}
                            />
                            <ListItem
                                primaryText="Is there any food that's halal?"
                                leftIcon={<HalalIcon />}
                                rightToggle={<DeliciousnessToggle name="has_halal" />}
                            />
                            <ListItem
                                primaryText="Do you have coffee?"
                                leftIcon={<CoffeeIcon />}
                                rightToggle={<DeliciousnessToggle name="has_coffee" />}
                            />
                            <ListItem
                                primaryText="Are there bacon and eggs?"
                                leftIcon={<BaconandEggsIcon />}
                                rightToggle={<DeliciousnessToggle name="has_bacon_and_eggs" />}
                            />
                            <Divider />
                            <ListItem
                                primaryText="Red. Cross. Of. Shame."
                                leftIcon={<RedCrossofShameIcon />}
                                rightToggle={<DeliciousnessToggle name="has_nothing" />}
                            />
                            <ListItem
                                primaryText="They've run out of food!"
                                leftIcon={<ContentBlock color={yellow700} />}
                                rightToggle={<DeliciousnessToggle name="has_run_out" />}
                            />
                        </List>

                        <CustomTextField
                            name="has_free_text"
                            component={TextField}
                            floatingLabelText={"Anything else to add?"}
                            hintText={"What other types of delicious are here?"}
                            fullWidth={true}
                        />
                    </FormCardText>
                </Card>

                <Card>
                    <FormCardTitle title={"Stall Information"} />
                    <FormCardText>
                        <CustomTextField
                            name="stall_name"
                            component={TextField}
                            floatingLabelText={"Stall name"}
                            hintText={"The name of the stall that is here"}
                            fullWidth={true}
                        />
                        <CustomTextField
                            name="stall_description"
                            component={TextField}
                            multiLine={true}
                            floatingLabelText={"Stall description"}
                            hintText={"A brief description of the stall"}
                            fullWidth={true}
                        />
                        <CustomTextField
                            name="stall_website"
                            component={TextField}
                            floatingLabelText={"Stall website"}
                            hintText={"A link to the website of the people organising the stall"}
                            fullWidth={true}
                        />
                    </FormCardText>
                </Card>

                <Card>
                    <FormCardTitle title={"Polling Place Information"} />
                    <FormCardText>
                        <CustomField
                            name="polling_place_type"
                            component={SelectField}
                            floatingLabelText={"What type of polling place is this?"}
                            fullWidth={true}
                        >
                            {pollingPlaceTypes.map((type: string) => <MenuItem key={type} value={type} primaryText={type} />)}
                        </CustomField>
                        <CustomTextField
                            name="extra_info"
                            component={TextField}
                            floatingLabelText={"Extra info"}
                            hintText={"Is there any extra information to add?"}
                            fullWidth={true}
                        />
                        <CustomTextField
                            name="source"
                            component={TextField}
                            floatingLabelText={"Source of this report"}
                            hintText={"What is the source? (e.g. Twitter, Facebook, School Newsletter)"}
                            fullWidth={true}
                        />
                    </FormCardText>
                    <CardActions>
                        <RaisedButton label={"Save"} primary={true} onClick={onSaveForm} />
                        <HiddenButton type="submit" />
                    </CardActions>
                </Card>
            </form>
        )
    }
}

// Decorate the form component
let PollingPlaceFormReduxForm = reduxForm({
    form: "pollingPlace", // a unique name for this form
    enableReinitialize: true,
    onChange: (values: object, dispatch: Function, props: any) => {
        // console.log("values", values)
        // props.onFormChange(values, dispatch, props)
    },
})(PollingPlaceForm)

export default PollingPlaceFormReduxForm
