import React from "react";
import {compose} from "redux";
import {getProduct} from "../../redux/productReducer";
import {connect} from "react-redux";
import s from "./ProductPage.module.css";
import a from "./../../App.module.css"
import {addProduct} from "../../redux/cartReducer";
import Attributes from "../common/Attributes/Attributes";
import Loader from "../common/Loader";
import {findPrice, withRouter} from "../../redux/funtions";
import {Interweave} from 'interweave';
import {transformText} from "./interweaveStyle";


class ProductPage extends React.Component {
    state = {
        mainImage: undefined,
        options: []
    }

    componentDidMount() {
        let productId = this.props.router.params.productId;
        this.props.getProduct(productId);
        if (this.props.product.id) {
            this.setState({mainImage: this.props.product.gallery.find(el => el !== undefined)})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.product.id !== this.props.product.id) {
            this.setState({
                mainImage: this.props.product.gallery.find(el => el !== undefined),
                options: []
            })
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
                            {!product.inStock && <span>OUT OF STOCK</span>}
                        </div>

                        <div className={s.name}>
                            <div>
                                <h2>{product.name}</h2>
                                <h2 className={s.brand}>{product.brand}</h2>
                            </div>

                            {product.attributes.map(attributes =>
                                <Attributes key={attributes.name} attributes={attributes}
                                            addOption={this.addOption} isDisabled={false}
                                            options={product.options} productId={product.id}/>
                            )}

                            <div className={s.price}>
                                <h4>PRICE:</h4>
                                <p>
                                    {this.props.currentCurrency}
                                    {this.props.product.id && findPrice(product.prices, this.props.currentCurrency)}
                                </p>
                            </div>

                            <button disabled={!product.inStock}
                                    onClick={product.inStock
                                        ? () => this.props.addProduct(product, this.state.options) : null}>
                                Add to cart
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
        currentCurrency: state.currency.currentCurrency,
    }
}

export default compose(
    connect(mapStateToProps, {getProduct, addProduct}),
    withRouter
)(ProductPage);

