import React from "react";
import Autosuggest from "react-autosuggest";
const fs = require("fs");

//ISO country object prototype
const isoCountry = {
  toString: function() {
    return this.description;
  }
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

      //Provide a toString method to the objects in the array
      this.arrIsoCountries.forEach(isoCtry => {
        Object.setPrototypeOf(isoCtry, isoCountry);
      });
    });
  }

  //Create an array of isoCountry objects which match
  //the input value passed into the function
  getSuggestions = inpValue => {
    //https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    function escRegexChars(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    //Important, inpValue will almost always be a string but
    //can sometimes be undefined!
    if (!inpValue || inpValue.length <= 1) {
      return [];
    }

    let sInputValue = escRegexChars(inpValue.trim());

    const regExp = new RegExp(sInputValue, "i");

    if (sInputValue.length === 2) {
      return this.arrIsoCountries.filter(isoCtry => regExp.test(isoCtry.code));
    }

    return this.arrIsoCountries.filter(isoCtry =>
      regExp.test(isoCtry.description)
    );
  };

  //In this inplementation getSuggestionValue returns a
  //isoCountry object
  getSuggestionValue = isoCtry => {
    //Please note that in this inplementation inpValue will
    //always be an isoCountry object
    //console.log('isoCtry is a ' + typeof isoCtry);

    return isoCtry;
  };

  //renderSuggestion returns JSX
  renderSuggestion = isoCtry => <span>{isoCtry.toString()}</span>;

  onChange = (event, { newValue }) => {
    //Please note that, in this inplementation, newValue can
    //either be a string, in case the country text input has
    //focus, or, in case an item in the country dropdown is
    //selected, an isoCountry object
    //console.log("newValue is a " + typeof newValue);

    //Update the state of the the higher level component to
    //reflect the selected country code
    if (!newValue.code) {
      this.props.updIsoCountryCode("");
    } else {
      this.props.updIsoCountryCode(newValue.code);
    }

    //Update the state of this component to keep track of
    //the country name
    this.setState({
      value: newValue.toString()
    });
  };

  //The function below retuns an array of isoCountry objects
  onSuggestionsFetchRequested = ({ value }) => {
    //Variable value will be of type string
    //console.log('value is a ' + typeof value);

    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  //The function below retuns an empty array
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
          readOnly={true}
          tabIndex={-1}
          value={this.props.isoCountryCode}
        />
      </div>
    );
  }
}

export { CountryAutosuggest };
