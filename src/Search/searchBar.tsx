import axios from 'axios';
import * as React from 'react';
import { Col, Row } from 'react-flexbox-grid';

const styles = {
  border: 'none',
  height: '60px',
  textAlign: 'center',
  width: '600px',
  padding: '0px',
  fontSize: '1.2rem',
} as React.CSSProperties;

const searchButtonStyle = {
  border: 'none',
  height: '61px',
  width: '126px',
  backgroundColor: '#ff4554',
  color: '#fff',
  fontFamily: 'sans-serif',
  fontSize: '1.2rem',
  padding: '0px',
  cursor: 'pointer',
}

const API_URL = 'http://www.amiiboapi.com/api/';

interface IState {
  searchTerm?: string | null,
  characterList?: string[] | null,
  amiiboList?: any[] | null,
  searched?: boolean,
}

// interface IAmiibo {
//   amiiboSeries: string,
//   character: string,
//   gameSeries: string,
//   head: string,
//   image: string,
//   name: string,
//   release: object,
//   // {
//   //   au: "2014-11-29",
//   //   eu: "2014-11-28",
//   //   jp: "2014-12-06",
//   //   na: "2014-11-21"
//   // },
//   tail: string,
//   type: string,
// }

class Search extends React.Component<IState> {
  public state = {
    amiiboList: [],
    characterList: [],
    searchTerm: '',
    searched: false,
  }
  public searchInput :any = {};
  public componentDidMount = () => {
    this.setTypeAhead();
    this.searchInput.focus();
  }

  public setTypeAhead = () => {
    axios.get(`${API_URL}amiibo`)
      .then(({ data }) => {
        // tslint:disable-next-line:no-console
        const characterList :string[] = [];
        // characterList = data.amiibo.map((amiibo :any) => characterList.push(amiibo.character))
        // tslint:disable-next-line:no-console
        data.amiibo.map((amiibo :any) => characterList.push(amiibo.character))
        this.setState({
          characterList,
        })
      })
  }
  public changeSearch = (e: any) => {
    // tslint:disable-next-line:no-console
    console.log(this.state);
    this.setState({searchTerm: e.target.value});
  }

  public submitSearch = () => {
    // TODO: Add error handling for no results
    axios.get(`${API_URL}amiibo?character=${this.state.searchTerm}`)
      .then(({ data }) => {
        // tslint:disable-next-line:no-console
        console.log(data);
        this.setState({
          amiiboList: data.amiibo,
          searched: true,
        })
        // tslint:disable-next-line:no-console
        console.log(this.state);
      })

  }

  public renderHomePage = () => {
    return (
    <section style={{ border: '1px solid #c3c3c3' }}>
      <input
          ref={(input) => { this.searchInput = input; }} 
          style={styles}
          type="text"
          value={this.state.searchTerm} onChange={this.changeSearch}
      />
      <button style={searchButtonStyle} type="submit" onClick={this.submitSearch}>Search</button>
    </section>);
  }

  public renderSearchResults = () => {
    return (
      this.state.amiiboList.map((amiibo :any, index :number) => {
          // tslint:disable-next-line:no-console
          console.log(amiibo.name);
          return (
            <Col xs={3} key={index}>
              <p>{amiibo.name}</p>
              <img src={amiibo.image} />
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
        {/* { this.state.searchTerm !== '' &&
          <section>
            {this.state.characterList.map((character) => <div key={character}>{character}</div>)}
          </section>
        } */}
      </section>
    );
  }
}

export default Search;
