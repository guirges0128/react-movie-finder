class MovieFinder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //store the value of the input
            searchTerm: '',
            //store the search results from OMDBAPI
            results: [],
            error: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        //target input from user
        this.setState({searchTerm: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        let {searchTerm} = this.state; //object deconstructure
        searchTerm = searchTerm.trim();
        if(!searchTerm) {
            return;
        }
        //make AJAX request to get list of results
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=fd3dac35`).then((response) => {
            if (response.ok) {
               return response.json();
            }
            throw new Error('Request was either a 404 or 500');
        }).then((data) => {
            //if response unsuccesful
          if (data.Response === 'False') {
            throw new Error(data.Error);
          }
          //check if response and search is succesful
          if (data.Response === 'True' && data.Search) {
            //update the state of results & error object if succesful
            this.setState({ results: data.Search, error: '' });
          }
        }).catch((error) => {
            //if error occurs, return error message
          this.setState({ error: error.message });
          console.log(error);
        })
    }

    render() {
        const {searchTerm, results, error} = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <form onSubmit={this.handleSubmit} className="form-inline my-4">
                            <input
                                type="text"
                                className="form-control mr-sm-2"
                                placeholder="frozen"
                                //user input
                                value={searchTerm}
                                //event.target.value
                                onChange={this.handleChange}
                            />
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                        {(() => {
                            if (error) {
                                return error;
                            }
                            return results.map((movie) => {
                                return <Movie key={movie.imdbID} movie={movie} />;
                            })
                        })()}
                    </div>
                </div>
            </div>
        )
    }
}
//housing the movie props in a smaller component
const Movie = (props) => {
    const {Title, Year, imdbID, Type, Poster} = props.movie;

    return (
        <div className="row">
            <div className="col-4 col-md-3 mb-3">
                <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
                    <img src={Poster} className="img-fluid"/>
                </a>
            </div>
            <div className="col-8 col-md-9 mb-3">
                <a href={`https:// www.imdb.com/title/${imdbID}/`} target="_blank">
                    <h4>{Title}</h4>
                    <p>{Type} | {Year}</p>
                </a>
            </div>
        </div>
    )
}

ReactDOM.render(
    <MovieFinder/>,
    document.getElementById('root')
);