import React from "react";
import Autosuggest from "react-autosuggest";
const fs = require("fs");

class CountryAutosuggest extends React.Component {
  constructor(props) {
    super(props);

    this.arrCountries = null;
    this.state = { value: "", suggestions: [] };

    fs.readFile("../assets/json/isoCountry.json", (err, data) => {
      if (err) throw err;
      this.arrCountries = JSON.parse(data);
      console.log("Number of countries " + this.arrCountries.length);
    });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const AutosuggestInpProps = {
      placeholder: "Country",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest suggestions={suggestions} inputProps={AutosuggestInpProps} />
    );
  }
}

export { CountryAutosuggest };
