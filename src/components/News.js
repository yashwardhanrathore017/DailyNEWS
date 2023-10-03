import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=>{
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


 

  const updateNews=async()=> {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading({ loading: true });
    let data = await fetch(url);
    props.setProgress(30)
    let parsedData = await data.json()
    props.setProgress(70)
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    console.log(parsedData);
    props.setProgress(100)
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
     updateNews();
    //  eslint-disable-next-line
  }, [])

   //"eslint-disable-next-line" is used for solving error- " Line 38:6:  React Hook useEffect has a missing dependency: 'updateNews'. Either include it or remove the dependency array  react-hooks/exhaustive-deps"
  

  //async componentDidMount() {
    // let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=a87ef26d9685417daa86d6ff4625c503&page=1&pageSize=${props.pageSize}`;
    // this.setState({loading: true});
    // let data= await fetch(url);
    // let parsedData= await data.json()
    // console.log(parsedData);
    // this.setState({articles : parsedData.articles, 
    //   totalResults:parsedData.totalResults,
    //   loading : false})
  //}

  // handlePrevClick=async()=>{
  // let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=a87ef26d9685417daa86d6ff4625c503&page=${this.state.page-1}&pageSize=${props.pageSize}`;
  // this.setState({loading: true});
  // let data= await fetch(url);
  // let parsedData= await data.json()
  // console.log(parsedData);

  // this.setState({
  //   page: this.state.page-1,
  //   articles : parsedData.articles,
  //   loading: false
  // })
  //   this.setState({page:this.state.page-1});
  //   this.updateNews();
  // }

  // handleNextClick=async()=>{
  // if(!(this.state.page+1> Math.ceil(this.state.totalResults/props.pageSize))){

  //   let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=a87ef26d9685417daa86d6ff4625c503&page=${this.state.page+1}&pageSize=${props.pageSize}`;
  //   this.setState({loading: true});
  //   let data= await fetch(url);
  //   let parsedData= await data.json()

  //   this.setState({
  //     page: this.state.page+1,
  //     articles : parsedData.articles,
  //     loading: false
  // })
  // }

  //alter and optimized way for the method commented above
  // this.setState({page:this.state.page+1});
  // this.updateNews();

  // }

  const fetchMoreData = async() => {
    
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1 );
    let data = await fetch(url);
    let parsedData = await data.json()
    
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults,)
    setLoading(false)

  };

  
    return (
      <>
        <h1 className="text-center" style={{ margin: '90px 0px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        {loading &&<Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!== totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
          <div className="row">
            {/* {!this.state.loading && this.state.articles.map((element)=>{  */}
            {articles.map((element, index) => {
              return <div className="col-md-4" key={index}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}


          </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark"onClick={this.handlePrevClick}>&larr; Previous</button>
        <button disabled={this.state.page+1> Math.ceil(this.state.totalResults/props.pageSize)} type="button" className="btn btn-dark"onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      </>
    )
  
}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "General"
}


News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}


export default News