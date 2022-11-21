import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  console.log(props)
  const {imageUrl, title, price, brand, rating} = item

  return (
    <div className="similar-product-card">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-price-star-rating-con">
        <p className="similar-price-product">Rs {price}/-</p>

        <div className="similar-star-rating">
          <p className="similar-rating">{rating}</p>
          <img
            alt="star"
            className="similar-star-image"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
          />
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem
