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
    // this.setTypeAhead();
    this.searchInput.focus();
  }

  public setTypeAhead = () => {
    axios.get(`${API_URL}gameseries`)
      .then(({ data }) => {
        const characterList :string[] = [];
        data.amiibo.map((character :any) => characterList.push(character.name))
        console.log(characterList.toString())
        this.setState({
          characterList,
        })
      })
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
        console.log(error);
        this.setState({
          amiiboList: [],
          noResults: true,
        })
      })
  }

  public renderHomePage = () => {
    let placeholderText = '';
    if (this.state.selectedOption === 'character'){
      placeholderText = 'Mario';
    }
    if (this.state.selectedOption === 'game'){
      placeholderText = 'The Legend of Zelda';
    }
    if (this.state.selectedOption === 'amiiboseries'){
      placeholderText = 'Super Smash Bros.';
    }
    return (
      <section style={{ marginTop: '24px' }}>
        <Row>
          <Col xs={12} md={4}>
            <select onChange={this.handleCategoryChange} value={this.state.selectedOption}>
              <option value="character">Character</option>
              <option value="game">Game</option>
              <option value="amiiboseries">Amiibo Series</option>
            </select>
          </Col>
          <Col xs={12} md={4}>
          <input
              ref={(input) => { this.searchInput = input; }} 
              style={searchStyles}
              type="text"
              value={this.state.searchTerm} onChange={this.changeSearch}
              placeholder={placeholderText}
              onKeyPress={this.submitSearchThroughKey}
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
  public renderDetailsModal = () => {
    //Really basic modal functionality for details view
    return (
      <section style={{
        position: 'fixed',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
      }}>
        <section style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid rgb(204, 204, 204)',
            background: 'rgb(255, 255, 255)',
            overflow: 'auto',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
            }}>
          <Row>
            <Col md={11}>
              <h3>{this.state.modalDetails.name}</h3>
            </Col>
            <Col md={1}><button onClick={this.closeModal}>x</button></Col>
          </Row>
          <Row>
            <Col md={4}>
              <img style={{ maxHeight: '400px' }} src={this.state.modalDetails.image} />
            </Col>
            <Col md={8} style={{ textAlign: 'left' }}>
              <Row>
                <Col md={2}>Character:</Col>
                <Col md={6}>{this.state.modalDetails.character}</Col>
              </Row>
              <Row>
                <Col md={2}>Game Series:</Col>
                <Col md={6}>{this.state.modalDetails.gameSeries}</Col>
              </Row>
              <Row>
                <Col md={2}>Head:</Col>
                <Col md={6}>{this.state.modalDetails.head}</Col>
              </Row>
              <Row>
                <Col md={2}>Name:</Col>
                <Col md={6}>{this.state.modalDetails.name}</Col>
              </Row>
              <Row>
                <Col md={2}>NA Release:</Col>
                <Col md={6}>{this.state.modalDetails.release.na}</Col>
              </Row>
              <Row>
                <Col md={2}>AU Release:</Col>
                <Col md={6}>{this.state.modalDetails.release.au}</Col>
              </Row>
              <Row>
                <Col md={2}>EU Release:</Col>
                <Col md={6}>{this.state.modalDetails.release.eu}</Col>
              </Row>
              <Row>
                <Col md={2}>JP Release:</Col>
                <Col md={6}>{this.state.modalDetails.release.jp}</Col>
              </Row>
              <Row>
                <Col md={2}>Tail:</Col>
                <Col md={6}>{this.state.modalDetails.tail}</Col>
              </Row>
              <Row>
                <Col md={2}>Type:</Col>
                <Col md={6}>{this.state.modalDetails.type}</Col>
              </Row>
            </Col>
          </Row>
        </section>
      </section>
    )
  }

  public setModalDetails = (amiibo: any) => {
    this.setState({ modalDetails: amiibo, modalVisible: true })
  }

  public renderSearchResults = () => {
    return (
      <Row>
        {this.state.amiiboList.map((amiibo :any, index :number) => {
          return (
            <Col xs={12} md={4} lg={3} key={index}>
              <button
                style={{ border: 'none', cursor: 'pointer', background: 'none' }}
                onClick={() => this.setModalDetails(amiibo)}
              >
                <p>{amiibo.name}</p>
                <img style={{ maxHeight: '400px' }} src={amiibo.image} />
              </button>
            </Col>
          );
        })}
      </Row>);
  }

  public render() {
    return (
      <section style={{ minHeight: '100vh' }}>
        {this.renderHomePage()}
        {this.state.searched && this.renderSearchResults()}
        {this.state.modalVisible && this.renderDetailsModal()}
        <Row center="xs" style={{ paddingTop: '60px' }}>
          {this.state.noResults && "No results"}
        </Row>
      </section>
    );
  }
}

export default Search;
