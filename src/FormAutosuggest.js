import React from "react";
import { CountryAutosuggest } from "./CountryAutosuggest";

class FormAutosuggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isoCountryCode: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;

    event.persist(); //http://bit.ly/2StVoUa

    this.setState((prevState, props) => {
      return { [name]: event.target.value };
    });
  }

  handleSubmit(event) {
    alert("Submit " + JSON.stringify(this.state));
    event.preventDefault();
  }

  render() {
    return (
      <form
        encType="application/x-www-form-urlencoded"
        onSubmit={this.handleSubmit}
      >
        <CountryAutosuggest
          onChange={this.handleChange}
          isoCountryCode={this.state.isoCountryCode}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export { FormAutosuggest };
