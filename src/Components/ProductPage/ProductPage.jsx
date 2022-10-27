import React from "react";
import {withRouter} from "../../withRouter";
import {compose} from "redux";
import {requestProductId} from "../../redux/productReducer";
import {connect} from "react-redux";
import s from "./ProductPage.module.css";
import a from "./../../App.module.css"
import {addProduct} from "../../redux/cartReducer";
import Attributes from "../common/Attributes/Attributes";
import {Interweave} from 'interweave';
import {transformText} from "./interweaveStyle";
import Loader from "../common/Loader";
import {findPrice} from "../../redux/funtions";


class ProductPage extends React.Component {

    state = {
        mainImage: this.props.product.mainImage,
        price: this.props.product.firstPrice,
        options: []
    }

    componentDidMount() {
        let productId = this.props.router.params.productId;
        this.props.requestProductId(productId)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.product.id !== this.props.product.id) {
            this.setState({
                mainImage: this.props.product.mainImage,
                price: this.props.product.firstPrice
            })
        }
        if (prevProps.currentCurrency !== this.props.currentCurrency) {
            this.setState({price: findPrice(this.props.product.prices, this.props.currentCurrency)})
        }
    }

    changePhoto = (i) => {
        this.setState({mainImage: this.props.product.gallery[i]})
    }

    addOption = (option) => {
        let index = this.state.options.findIndex(item => item.name === option.name)
        if (index === -1) {
            this.setState({options: [...this.state.options, option]})
        } else {
            this.setState({options: this.state.options.map((el, i) => (i === index ? option : el))})
        }
    }

    cleanOptions = () => {
        this.setState({options: []})
    }

    render() {
        let product = this.props.product;
        return <>

            {this.props.isFetching
                ? <Loader/>

                : <div className={s.productPage}>

                    <div className={s.gallery}>
                        {product.gallery.map((img, index) =>
                            <img alt={'prevImg'} key={img} src={img} onClick={() => this.changePhoto(index)}/>
                        )}
                    </div>

                    <div className={s.info}>
                        <div className={!product.inStock ? a.outOfStock : null}>
                            <img className={s.productPhoto} alt={'product img'} src={this.state.mainImage}/>
                            {!product.inStock && <span style={{fontSize: 30}}>OUT OF STOCK</span>}
                        </div>

                        <div className={s.name}>
                            <div>
                                <h2>{product.name}</h2>
                                <h2 style={{fontWeight: 400, marginBottom: 19}}>{product.brand}</h2>
                            </div>

                            {product.attributes.map(attributes =>
                                <Attributes key={attributes.name} attributes={attributes}
                                            addOption={this.addOption} isDisabled={false}
                                            options={product.options} productId={product.id}/>
                            )}

                            <div className={s.price}>
                                <h4 style={{marginBottom: 20}}>PRICE:</h4>
                                <p>
                                    {this.props.currentCurrency}
                                    {this.state.price}
                                </p>
                            </div>

                            <button onClick={product.inStock
                                ? () => {
                                    this.props.addProduct(product, this.state.options);
                                    this.cleanOptions()
                                }
                                : null}>
                                ADD TO CART
                            </button>

                            <div className={s.description}>
                                <Interweave content={product.description} transform={transformText}/>
                            </div>

                        </div>
                    </div>
                </div>

            }

        </>
    }
}


let mapStateToProps = (state) => {
    return {
        product: state.product.product,
        isFetching: state.product.isFetching,
        currentCurrency: state.currency.currentCurrency
    }
}

export default compose(
    connect(mapStateToProps, {requestProductId, addProduct}),
    withRouter
)(ProductPage);
