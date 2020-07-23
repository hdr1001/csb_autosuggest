import React from "react";
import Autosuggest from "react-autosuggest";
const fs = require("fs");

function IsoCountry(code, desc) {
  this.code = code;
  this.description = desc;
}

IsoCountry.prototype.toString = function() {
  return this.description;
};

IsoCountry.prototype.trim = function() {
  return this.description.trim();
};

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

      this.arrIsoCountries = this.arrIsoCountries.map(
        isoCountry => new IsoCountry(isoCountry.code, isoCountry.description)
      );
    });
  }

  getSuggestions = inpValue => {
    //https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    function escRegexChars(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    let sInputValue = inpValue.toString();

    sInputValue = escRegexChars(sInputValue.trim());

    if (sInputValue.length <= 1) {
      return [];
    }

    const regExp = new RegExp(sInputValue, "i");

    if (sInputValue.length === 2) {
      return this.arrIsoCountries.filter(isoCountry =>
        regExp.test(isoCountry.code)
      );
    }

    return this.arrIsoCountries.filter(isoCountry =>
      regExp.test(isoCountry.description)
    );
  };

  getSuggestionValue = isoCountry => isoCountry;

  renderSuggestion = isoCountry => <span>{isoCountry.toString()}</span>;

  onChange = (event, { newValue }) => {
    if (!newValue.code) {
      this.props.updIsoCountryCode("");
    } else {
      this.props.updIsoCountryCode(newValue.code);
    }

    this.setState({
      value: newValue.toString()
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
