/*
Author: Ted Jenks

React-Native component to serve as a portal for the entry of personal details
on signing up to the service.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Local imports

// Third party packages
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../../../style/styles';

// Global constants

//------------------------------------------------------------------------------

/* BODY */

class DatePicker extends Component {
  state = {
    openDay: false,
    valueDay: null,
    defaultValueDay: '',
    itemsDay: [],
    openMonth: false,
    valueMonth: null,
    defaultValueMonth: '',
    itemsMonth: [],
    openYear: false,
    valueYear: null,
    defaultValueYear: '',
    itemsYear: [],
  };

  constructor(props) {
    super();
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({value: i, label: i});
    }
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({value: i, label: i});
    }
    const years = [];
    const year = props.endYear || new Date().getFullYear();
    const yearStart = props.startYear || year - 100;
    for (let i = year; i >= yearStart; i--) {
      years.push({value: i, label: i});
    }
    this.state.itemsDay = days;
    this.state.itemsMonth = months;
    this.state.itemsYear = years;
    if (props.date) {
      const split = props.date.split('-');
      this.placeholderD = split[2];
      this.placeholderM = split[1];
      this.placeholderY = split[0];
    }
  }

  setOpenDay = open => {
    this.setState({
      openDay: open,
    });
  };

  setValueDay = async callback => {
    await this.setState(state => ({
      valueDay: callback(state.value),
    }));
    this.checkComplete();
  };

  setItemsDay = callback => {
    this.setState(state => ({
      itemsDay: callback(state.items),
    }));
  };

  setOpenMonth = open => {
    this.setState({
      openMonth: open,
    });
  };

  setValueMonth = async callback => {
    await this.setState(state => ({
      valueMonth: callback(state.value),
    }));
    this.checkComplete();
  };

  setItemsMonth = callback => {
    this.setState(state => ({
      itemsMonth: callback(state.items),
    }));
  };

  setOpenYear = open => {
    this.setState({
      openYear: open,
    });
  };

  setValueYear = async callback => {
    await this.setState(state => ({
      valueYear: callback(state.value),
    }));
    this.checkComplete();
  };

  setItemsYear = callback => {
    this.setState(state => ({
      itemsYear: callback(state.items),
    }));
  };

  checkComplete = () => {
    if (this.state.valueDay && this.state.valueMonth && this.state.valueYear) {
      let dateString =
        this.state.valueYear.toString() +
        '-' +
        this.state.valueMonth.toString().padStart(2, '0') +
        '-' +
        this.state.valueDay.toString().padStart(2, '0');
      console.log(dateString);
      this.props.onComplete(dateString);
    }
  };

  render() {
    const dropdownContainerStyle = {
      flex: 1,
      margin: 5,
    };
    const dropdownStyle = {
      ...styles.input,
      borderRadius: 23,
    };
    const placeholderStyle = {
      color: '#c1c1d5',
    };
    return (
      <View style={{flexDirection: 'row', width: '96%', alignSelf: 'center'}}>
        <DropDownPicker
          containerProps={{
            style: dropdownContainerStyle,
          }}
          style={dropdownStyle}
          dropDownContainerStyle={dropdownStyle}
          placeholder={this.placeholderD || "Day"}
          placeholderStyle={placeholderStyle}
          open={this.state.openDay}
          value={this.state.valueDay}
          items={this.state.itemsDay}
          setOpen={this.setOpenDay}
          setValue={this.setValueDay}
          setItems={this.setItemsDay}
          defaultValue={this.state.defaultValueDay}
        />
        <DropDownPicker
          containerProps={{
            style: dropdownContainerStyle,
          }}
          style={dropdownStyle}
          dropDownContainerStyle={dropdownStyle}
          placeholder={this.placeholderM || "Month"}
          placeholderStyle={placeholderStyle}
          open={this.state.openMonth}
          value={this.state.valueMonth}
          items={this.state.itemsMonth}
          setOpen={this.setOpenMonth}
          setValue={this.setValueMonth}
          setItems={this.setItemsMonth}
          defaultValue={ {label: 1} }
        />
        <DropDownPicker
          containerProps={{
            style: dropdownContainerStyle,
          }}
          style={dropdownStyle}
          dropDownContainerStyle={dropdownStyle}
          placeholder={ this.placeholderY || "Year"}
          placeholderStyle={placeholderStyle}
          open={this.state.openYear}
          value={this.state.valueYear}
          items={this.state.itemsYear}
          setOpen={this.setOpenYear}
          setValue={this.setValueYear}
          setItems={this.setItemsYear}
          defaultValue={this.state.defaultValueYear}
        />
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default DatePicker;
