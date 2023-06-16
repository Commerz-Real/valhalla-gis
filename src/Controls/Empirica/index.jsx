import React from 'react'
import { Divider, Dropdown } from 'semantic-ui-react'

class Empirica extends React.Component {
  state = {
    method: '',
    inputValue: 0,
  }

  handleDropdownChange = (event, data) => {
    this.setState({ method: data.value })
  }

  handleInputChange = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '')
    this.setState({ inputValue })
  }

  handleIncrement = () => {
    this.setState((prevState) => ({
      inputValue: prevState.inputValue + 1,
    }))
  }

  handleDecrement = () => {
    this.setState((prevState) => ({
      inputValue: Math.max(prevState.inputValue - 1, 0),
    }))
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
              <div className="ui toggle checkbox">
                <input type="checkbox" name="public" id="empiricaAnzeigen" />
                <label
                  style={{
                    fontSize: '1em',
                  }}
                >
                  Empirica
                </label>
              </div>
            </div>
            <Divider fitted />
            <div className="flex flex-wrap justify-between">
              <Dropdown
                selection
                className="ui selection dropdown"
                options={options}
                onChange={this.handleDropdownChange}
                placeholder="Miete oder Kauf"
              />
              <br />
              <div className="ui container">
                <div className="input-container">
                  <input
                    type="text"
                    value={this.state.inputValue}
                    onChange={this.handleInputChange}
                  />
                  <div className="input-controls">
                    <button onClick={this.handleIncrement}>+</button>
                    <button onClick={this.handleDecrement}>-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Empirica
