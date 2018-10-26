import axios from 'axios';
import * as React from 'react';
import * as Autocomplete from 'react-autocomplete';
import { Col, Row } from 'react-flexbox-grid';
import { searchButtonStyle, searchStyles } from './styles';
import { DetailsModal } from '../Modal';
import { SearchResults } from '../Results';
import {
  API_URL,
  AMIIBO_CHARACTERS,
  AMIIBO_SERIES,
  AMIIBO_GAMES,
 } from './constants';

interface IState {
  searchTerm?: string | null,
  characterList?: string[] | null,
  amiiboList?: any[] | null,
  searched?: boolean,
  noResults?: boolean,
  selectedOption?: string,
  cachedResults?: any,
  modalDetails?: any,
  modalVisible?: boolean,
}

class Search extends React.Component<IState> {
  public state = {
    amiiboList: [],
    characterList: [],
    searchTerm: '',
    searched: false,
    noResults: false,
    selectedOption: 'character',
    cachedResults: {} as any,
    modalDetails: {} as any,
    modalVisible: false,
  }
  public searchInput :any = {};
  public componentDidMount = () => {
    this.searchInput.focus();
  }

  public changeSearch = (e: any) => {
    this.setState({searchTerm: e.target.value});
  }

  public handleCategoryChange = (e :any) => {
    this.setState({selectedOption: e.target.value, searchTerm: ''})
  }

  public submitSearchThroughKey = (e :any) => {
    if (e.key === 'Enter'){
      this.submitSearch();
    }
  }
  public submitSearch = () => {
    let searchString :string = '';
    if (this.state.selectedOption === 'character'){
      searchString = 'amiibo?character=';
    }
    if (this.state.selectedOption === 'game'){
      searchString = 'amiibo?gameseries=';
    }
    if (this.state.selectedOption === 'amiiboseries'){
      searchString = 'amiibo?amiiboSeries=';
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
        this.setState({
          amiiboList: [],
          noResults: true,
        })
      })
  }

  public renderHomePage = () => {
    let placeholderText :string = '';
    let autocompleteList :object[] = [];
    if (this.state.selectedOption === 'character'){
      placeholderText = 'Mario';
      autocompleteList = AMIIBO_CHARACTERS;
    }
    if (this.state.selectedOption === 'game'){
      placeholderText = 'The Legend of Zelda';
      autocompleteList = AMIIBO_GAMES.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.label === item.label
      )));
    }
    if (this.state.selectedOption === 'amiiboseries'){
      placeholderText = 'Super Smash Bros.';
      autocompleteList = AMIIBO_SERIES;
    }
    return (
      <section style={{ marginTop: '24px' }}>
        <Row>
          <Col xs={12} md={4}>
            <select
              style={{ minWidth:'50%', height: '60px', fontSize: '1.2rem' }}
              onChange={this.handleCategoryChange}
              value={this.state.selectedOption}>
              <option value="character">Character</option>
              <option value="game">Game</option>
              <option value="amiiboseries">Amiibo Series</option>
            </select>
          </Col>
          <Col xs={12} md={4}>
            <Autocomplete
              wrapperStyle={{ minWidth: '50%' }}
              renderInput={(props) =>
                <input
                  style={searchStyles}
                  type="text"
                  placeholder={placeholderText}
                  onKeyPress={this.submitSearchThroughKey}
                  {...props}
                />
              }
              ref={el => this.searchInput = el}
              items={autocompleteList}
              shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
              getItemValue={item => item.label}
              renderItem={(item, highlighted) =>
                <div
                  key={item.id}
                  style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                >
                  {item.label}
                </div>
              }
              value={this.state.searchTerm}
              onChange={e => this.setState({ searchTerm: e.target.value })}
              onSelect={searchTerm => this.setState({ searchTerm })}
            />
          </Col>
          <Col xs={12} md={4}>
          <button style={searchButtonStyle} type="submit" onClick={this.submitSearch}>Search</button>
          </Col>
        </Row>
      </section>
    );
  }

  public closeModal = () => {
    this.setState({ modalVisible: false, modalDetails: {} })
  }

  public setModalDetails = (amiibo: any) => {
    this.setState({ modalDetails: amiibo, modalVisible: true })
  }

  public render() {
    return (
      <section style={{ minHeight: '100vh' }}>
        {this.renderHomePage()}
        {this.state.searched &&
          <SearchResults
            amiiboList={this.state.amiiboList}
            setModalDetails={this.setModalDetails}
          />
        }
        {this.state.modalVisible &&
          <DetailsModal
            modalDetails={this.state.modalDetails}
            closeModal={this.closeModal}
          />}
        <Row center="xs" style={{ paddingTop: '60px' }}>
          {this.state.noResults && "No results"}
        </Row>
      </section>
    );
  }
}

export default Search;
