import React from 'react'
import { Input, Checkbox, Divider, Dropdown } from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react'

class Empirica extends React.Component {
  state = {
    method: '',
    inputValue: 0,
    baujahr: 0,
    flaeche: 0,
    kaltmiete: 0,
    startDate: '',
    endDate: '',
  }

  handleStartDateChange = (event, { value }) => {
    this.setState({ startDate: value })
  }

  handleEndDateChange = (event, { value }) => {
    this.setState({ endDate: value })
  }

  handleDropdownChange = (event, data) => {
    this.setState({ method: data.value })
  }

  handleInputChange = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '')
    this.setState({ inputValue })
  }

  handleBaujahrChange = (event) => {
    const baujahr = event.target.value.replace(/[^0-9]/g, '')
    this.setState({ baujahr })
  }

  handleFlaecheChange = (event) => {
    const flaeche = event.target.value.replace(/[^0-9]/g, '')
    this.setState({ flaeche })
  }

  handleKaltmieteChange = (event) => {
    const kaltmiete = event.target.value.replace(/[^0-9]/g, '')
    this.setState({ kaltmiete })
  }

  render() {
    const options = [
      { key: 1, text: 'Miete', value: 1 },
      { key: 0, text: 'Kauf', value: 0 },
    ]

    return (
      <React.Fragment>
        <div className="flex flex-column content-between">
          <div>
            <div className="pa2 flex flex-row justify-between">
              <Checkbox toggle id="empiricaAnzeigen" />
              <label
                style={{
                  fontSize: '1em',
                }}
              >
                Empirica
              </label>
            </div>
            <Divider fitted />
            <br />
            <Dropdown
              selection
              className="ui selection dropdown"
              options={options}
              onChange={this.handleDropdownChange}
              placeholder="Miete oder Kauf"
            />
            <br />
            <br />
            <label>Umkreissuche</label>
            <br />
            <Input
              value={this.state.inputValue}
              onChange={this.handleInputChange}
              type="number"
            />
            <br />
            <DateInput
              name="startDate"
              placeholder="Startdatum"
              value={this.state.startDate}
              iconPosition="left"
              onChange={this.handleStartDateChange}
            />
            <DateInput
              name="endDate"
              placeholder="Enddatum"
              value={this.state.endDate}
              iconPosition="left"
              onChange={this.handleEndDateChange}
            />
            <br />
            <label>Baujahr</label>
            <br />
            <Input
              value={this.state.baujahr}
              onChange={this.handleBaujahrChange}
              type="number"
              min="1900"
              max="2027"
              defaultValue="2023"
            />
            <br />
            <label>Fläche</label>
            <br />
            <Input
              value={this.state.flaeche}
              onChange={this.handleFlaecheChange}
              type="number"
              min="0"
              max="200"
            />
            <br />
            <label>Kaltmiete pro m^2</label>
            <br />
            <Input
              value={this.state.kaltmiete}
              onChange={this.handleKaltmieteChange}
              type="number"
              min="0"
              max="20"
            />
            <br />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Empirica
