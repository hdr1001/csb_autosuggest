import React from "react";
import Autosuggest from "react-autosuggest";
const fs = require("fs");

class CountryAutosuggest extends React.Component {
  constructor(props) {
    super(props);

    this.arrIsoCountries = null;

    this.state = { value: "", suggestions: [] };
  }

  componentDidMount() {
    fs.readFile("../assets/json/isoCountry.json", (err, data) => {
      if (err) throw err;
      this.arrIsoCountries = JSON.parse(data);
      console.log("Number of countries " + this.arrIsoCountries.length);
    });
  }

  getSuggestions = inpValue => {
    //https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    function escRegexChars(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    inpValue = escRegexChars(inpValue.trim());

    if (inpValue.length <= 1) {
      return [];
    }

    const regExp = new RegExp(inpValue, "i");

    if (inpValue.length === 2) {
      return this.arrIsoCountries.filter(isoCountry =>
        regExp.test(isoCountry.code)
      );
    }

    return this.arrIsoCountries.filter(isoCountry =>
      regExp.test(isoCountry.description)
    );
  };

  getSuggestionValue = isoCountry => isoCountry.code;

  renderSuggestion = isoCountry => <span>{isoCountry.description}</span>;

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
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
      <div className="countryAutosuggest">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={AutosuggestInpProps}
        />
        <input
          type="text"
          readOnly="true"
          tabIndex="-1"
          value={this.props.isoCountryCode}
        />
      </div>
    );
  }
}

export { CountryAutosuggest };
