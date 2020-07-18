import React from "react";

class CountryAutosuggest extends React.Component {
  render() {
    return (
      <input type="text" name="isoCountryCode" onChange={this.props.onChange} />
    );
  }
}

export { CountryAutosuggest };
