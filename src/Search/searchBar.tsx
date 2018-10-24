import axios from 'axios';
import * as React from 'react';

const styles = {
  border: '1px solid black',
  borderRadius: '50px',
  height: '42px',
  marginTop: '24px',
  textAlign: 'center',
  width: '600px',
} as React.CSSProperties;

const API_URL = 'http://www.amiiboapi.com/api/';

interface IState {
  searchTerm?: string | null,
  characterList?: string[] | null,
}

class Search extends React.Component<IState> {
  public state = {
    characterList: [],
    searchTerm: '',
  }
  public componentDidMount = () => {
    this.setTypeAhead();
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
  public render() {
    return (
      <input style={styles} type="text" value={this.state.searchTerm} onChange={this.changeSearch} />
    );
  }
}

export default Search;
