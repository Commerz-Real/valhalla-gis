import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Search, Form, Popup, Icon, Label, Accordion } from 'semantic-ui-react'
import { Slider } from '@mui/material'

import { Settings } from '../settings'

import { isValidCoordinates } from 'utils/geom'
import {
  updateTextInput,
  updateIsoSettings,
  fetchGeocode,
  makeIsochronesRequest,
  clearIsos,
} from 'actions/isochronesActions'

import { updatePermalink, zoomTo } from 'actions/commonActions'

import { debounce } from 'throttle-debounce'

class TopSearchBar extends Component {
  static propTypes = {
    isochrones: PropTypes.object,
    dispatch: PropTypes.func,
    use_geocoding: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.fetchGeocodeResults = debounce(200, this.fetchGeocodeResults)
    this.handleIsoSliderUpdateSettings = debounce(
      10,
      this.handleIsoSliderUpdateSettings
    )
    this.makeIsochronesRequest = debounce(100, () =>
      this.props.dispatch(makeIsochronesRequest())
    )
  }

  state = { activeIndex: 0, open: false }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleSearchChange = (event, { value }) => {
    const { dispatch } = this.props
    dispatch(updateTextInput({ userInput: value }))
  }

  handleRemoveIsos = (event, { value }) => {
    const { dispatch } = this.props
    dispatch(clearIsos())
  }

  fetchGeocodeResults(e) {
    const { dispatch, use_geocoding, isochrones } = this.props
    const { userInput } = isochrones

    this.setState({ open: true })

    if (userInput.length > 0 && e === 'Enter') {
      // make results visible
      if (use_geocoding) {
        dispatch(fetchGeocode(userInput))
      } else {
        const coords = userInput.split(/[\s,;]+/)
        // is this a coordinate?
        if (coords.length === 2) {
          const lat = coords[1]
          const lng = coords[0]
          if (isValidCoordinates(lat, lng)) {
            dispatch(
              fetchGeocode(userInput, [parseFloat(lng), parseFloat(lat)])
            )
          }
        }
      }
    }
  }

  handleResultSelect = (e, { result }) => {
    this.setState({ open: false })

    const { dispatch } = this.props
    dispatch(
      updateTextInput({
        userInput: result.title,
        addressindex: result.addressindex,
      })
    )
    dispatch(zoomTo([[result.addresslnglat[1], result.addresslnglat[0]]]))
    this.makeIsochronesRequest()
  }

  handleIntervalChange = (e, { value }) => {
    const { maxRange } = this.props.isochrones

    value = isNaN(parseInt(value)) ? 0 : parseInt(value)
    if (value > maxRange) {
      value = maxRange
    }

    const intervalName = 'interval'

    this.handleIsoSliderUpdateSettings({
      intervalName,
      value,
    })
  }

  handleRangeChange = (e, { value }) => {
    value = isNaN(parseInt(value)) ? 0 : parseInt(value)
    if (value > 120) {
      value = 120
    }

    const maxRangeName = 'maxRange'
    const intervalName = 'interval'

    this.handleIsoSliderUpdateSettings({
      maxRangeName,
      intervalName,
      value,
    })
    this.makeIsochronesRequest()
  }

  handleIsoSliderUpdateSettings = ({ value, maxRangeName, intervalName }) => {
    const { dispatch } = this.props
    // maxRangeName can be undefined if interval is being updated
    dispatch(
      updateIsoSettings({
        maxRangeName,
        intervalName,
        value: parseInt(value),
      })
    )

    dispatch(updatePermalink())
  }

  resultRenderer = ({ title, description }) => (
    <div className="flex-column">
      <div>
        <span className="title">{title}</span>
      </div>
      {description && description.length > 0 && (
        <div>
          <Icon disabled name="linkify" />
          <span className="description b">
            <a target="_blank" rel="noopener noreferrer" href={description}>
              OSM Link
            </a>
          </span>
        </div>
      )}
    </div>
  )

  render() {
    const { isFetching, geocodeResults, userInput, maxRange, interval } =
      this.props.isochrones
    const { activeIndex } = this.state

    const controlSettings = {
      maxRange: {
        name: 'Maximum Range',
        param: 'maxRange',
        description: 'The maximum range in minutes',
        unit: 'mins',
        settings: {
          min: 1,
          max: 120,
          step: 1,
        },
      },
      interval: {
        name: 'Interval Step',
        param: 'interval',
        description: 'The interval length in minutes.',
        unit: 'mins',
        settings: {
          min: 1,
          max: maxRange,
          step: 1,
        },
      },
    }

    return (
      <div>
        <div
          className="pa2 flex flex-row justify-between"
          style={{ alignItems: 'center' }}
        >
          <Popup
            content={userInput.length === 0 ? 'Enter Address' : userInput}
            size="tiny"
            mouseEnterDelay={500}
            trigger={
              <Search
                size="large"
                type="text"
                minCharacters={3}
                className={'pt2 pb2 pl3'}
                input={{ icon: 'search', iconPosition: 'left' }}
                onSearchChange={this.handleSearchChange}
                onResultSelect={this.handleResultSelect}
                resultRenderer={this.resultRenderer}
                showNoResults={false}
                open={this.state.open}
                onFocus={() => this.setState({ open: true })}
                onMouseDown={() => this.setState({ open: true })}
                loading={isFetching}
                results={geocodeResults}
                value={userInput}
                onKeyPress={(event) => {
                  this.fetchGeocodeResults(event.key)
                }}
                placeholder="Hit enter for search..."
              />
            }
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { isochrones } = state
  const { use_geocoding } = state.common.settings

  return {
    isochrones,
    use_geocoding,
  }
}

export default connect(mapStateToProps)(TopSearchBar)
