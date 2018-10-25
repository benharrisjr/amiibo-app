// tslint:disable:no-console
import axios from 'axios';
import * as React from 'react';
import { Col, Row } from 'react-flexbox-grid';
import { searchStyles, searchButtonStyle } from './styles';
import { API_URL } from './constants';

interface IState {
  searchTerm?: string | null,
  characterList?: string[] | null,
  amiiboList?: any[] | null,
  searched?: boolean,
  noResults?: boolean,
  selectedOption?: string,
}

class Search extends React.Component<IState> {
  public state = {
    amiiboList: [],
    characterList: [],
    searchTerm: '',
    searched: false,
    noResults: false,
    selectedOption: 'character',
  }
  public searchInput :any = {};
  public componentDidMount = () => {
    // this.setTypeAhead();
    this.searchInput.focus();
  }

  public setTypeAhead = () => {
    axios.get(`${API_URL}character`)
      .then(({ data }) => {
        const characterList :string[] = [];
        data.amiibo.map((character :any) => characterList.push(character.name))
        this.setState({
          characterList,
        })
      })
  }
  public changeSearch = (e: any) => {
    this.setState({searchTerm: e.target.value});
  }

  public handleRadioChange = (e :any) => {
    this.setState({selectedOption: e.target.value})
  }

  public submitSearch = () => {
    let searchString :string = '';
    if (this.state.selectedOption === 'character'){
      searchString = 'amiibo?character=';
    }
    if (this.state.selectedOption === 'game'){
      searchString = 'amiibo?gameseries=';
    }
    axios.get(`${API_URL}${searchString}${this.state.searchTerm}`)
      .then(({ data }) => {
        this.setState({
          amiiboList: data.amiibo,
          searched: true,
          noResults: false,
        })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          amiiboList: [],
          noResults: true,
        })
      })

  }

  public renderHomePage = () => {
    return (
      <section>
        <Row>
          <section style={{ border: '1px solid #c3c3c3' }}>
            <input
                ref={(input) => { this.searchInput = input; }} 
                style={searchStyles}
                type="text"
                value={this.state.searchTerm} onChange={this.changeSearch}
            />
            <button style={searchButtonStyle} type="submit" onClick={this.submitSearch}>Search</button>
          </section>
        </Row>
        <Row>
          <label>
            <input
              type="radio"
              value="character"
              checked={this.state.selectedOption === 'character'}
              onChange={this.handleRadioChange}
            />
            Character
          </label>
          <label>
            <input
              type="radio"
              value="game"
              checked={this.state.selectedOption === 'game'}
              onChange={this.handleRadioChange}
            />
            Game
          </label>
        </Row>
      </section>
    );
  }

  public renderSearchResults = () => {
    return (
      this.state.amiiboList.map((amiibo :any, index :number) => {
          return (
            <Col xs={3} key={index}>
              <p>{amiibo.name}</p>
              <img style={{ maxHeight: '400px' }} src={amiibo.image} />
            </Col>
          );
        }));
  }

  public render() {
    return (
      <section>
        <Row center="xs" style={{ marginTop: '24px' }}>
          {this.renderHomePage()}
        </Row>
        <Row>
          {this.state.searched && this.renderSearchResults()}
        </Row>
        <Row center="xs" style={{ paddingTop: '60px' }}>
          {this.state.noResults && "No results"}
        </Row>
      </section>
    );
  }
}

export default Search;
