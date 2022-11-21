import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'
// import {H} from 'jest-haste-map'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    productDetails: {},
    countOfProducts: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  caseConversion = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    similarProducts: data.similar_products,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const api = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(api, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedProducts = this.caseConversion(fetchedData)

      this.setState({
        productDetails: {...updatedProducts},
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  increaseCount = () => {
    this.setState(previous => ({
      countOfProducts: previous.countOfProducts + 1,
    }))
  }

  decrementCount = () => {
    this.setState(previous => ({
      countOfProducts: previous.countOfProducts - 1,
    }))
  }

  renderSimilarProducts = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails
    // console.log(productDetails)
    const updatedSimilarProducts = similarProducts.map(each =>
      this.caseConversion(each),
    )

    // console.log(updatedSimilarProducts)

    return (
      <div className="similar-products-con">
        <h1 className="sp-heading">Similar Products</h1>
        <div className="similar-product-items-con">
          {updatedSimilarProducts.map(each => (
            <SimilarProductItem key={each.id} item={each} />
          ))}
        </div>
      </div>
    )
  }

  renderProductDetailsView = () => {
    const {productDetails, countOfProducts} = this.state
    console.log(productDetails)

    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails

    return (
      <>
        <Header />
        <div className="image-description-con">
          <div className="image-con">
            <img src={imageUrl} alt="product" className="product-image" />
          </div>
          <div className="description-con">
            <h1 className="title-heading">{title}</h1>
            <p className="price-product">Rs {price}/-</p>
            <div className="star-rating-reviews-con">
              <div className="star-rating">
                <p className="rating">{rating}</p>
                <img
                  alt="star"
                  className="star-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                />
              </div>
              <p className="reviews">{totalReviews} REVIEWS</p>
            </div>
            <p className="description">{description}</p>
            <p className="available">
              Available: <p className="availability">{availability}</p>
            </p>
            <p className="available">
              Brand: <p className="availability">{brand}</p>
            </p>
            <hr />
            <div className="increment-decrement-buttons">
              <BsPlusSquare
                testid="plus"
                className="icons"
                onClick={this.increaseCount}
              />
              <p className="count-of-products">{countOfProducts}</p>
              <BsDashSquare
                testid="minus"
                className="icons"
                onClick={this.decrementCount}
              />
            </div>
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </>
    )
  }

  renderLoader = () => (
    <>
      <Header />
      <div testid="loader" className="loader">
        <Loader type="BallTriangle" height={50} width={50} />
      </div>
    </>
  )

  returnToProductsPage = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <>
      <Header />
      <div className="fv-con">
        <img
          alt="failure view"
          className="failure-image"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        />
        <h1 className="failure-heading">Product Not Found</h1>
        <button
          type="button"
          className="failure-button"
          onClick={this.returnToProductsPage}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
