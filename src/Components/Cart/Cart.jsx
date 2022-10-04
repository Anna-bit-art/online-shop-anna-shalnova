import React from "react";
import s from "./Cart.module.css"
import SizeBox from "../common/SizeBox/SizeBox";
import ColorBox from "../common/ColorBox/ColorBox";
import {compose} from "redux";
import {connect} from "react-redux";
import {decreaseQuantity, increaseQuantity} from "../../redux/cartReducer";
import SliderImage from "./SliderImage/SliderImage";
import {withRouter} from "../../withRouter";
import {NavLink} from "react-router-dom";


export class Cart extends React.Component {

    totalPrice = () => {

        let tax = 0.21
        let orders = this.props.orders;
        let i = orders[0].prices.findIndex((el) => el.currency.symbol === this.props.currentCurrency)

        let sum = orders.reduce((acc, item) => acc + item.quantity * item.prices[i].amount, 0).toFixed(2)
        let taxAmount = (sum * tax).toFixed(2)

        return { total: sum, tax: taxAmount }
    }


    render() {
        return (
            <div className={s.cartPage}>
                <h1>CART</h1>

                { this.props.orders.map( (order, key) =>
                    <div key={key} className={s.cartProduct}>

                        <div className={s.cartProductInfo}>
                            <NavLink to={'/pdp/' + order.id}>
                                <h3>{order.name}</h3>
                            </NavLink>

                            <h3 className={s.brand}>{order.brand}</h3>


                            <div className={s.priceBlock}>
                                <p>
                                    {this.props.currentCurrency + ' '}
                                    {order.prices.find((el) => el.currency.symbol === this.props.currentCurrency).amount}
                                </p>
                            </div>

                            { order.attributes.map(attributes =>
                                attributes.type === 'text'
                                    ? <SizeBox key={attributes.name} name={attributes.name} items={attributes.items}/>
                                    : null
                            ) }

                            { order.attributes.map(attributes =>
                                attributes.type === 'swatch'
                                    ? <ColorBox key={attributes.name} name={attributes.name} items={attributes.items} />
                                    : null
                            )}

                        </div>


                        <div className={s.cartProductPhoto}>

                            <div className={s.selectAmount}>
                                <input type={'button'} value={'+'} onClick={() => this.props.increaseQuantity(key)}/>
                                <input type={'button'} className={s.label} value={order.quantity}/>
                                <input type={'button'} value={'-'} onClick={() => this.props.decreaseQuantity(key, order.id)}/>
                            </div>

                            <div className={s.photos}>
                                <SliderImage key={key} images={order.gallery}/>
                            </div>

                        </div>

                    </div>
                )}

                <div className={s.total}>
                    <div>
                        <h5>Tax 21%:</h5>
                        <h5>Quantity:</h5>
                        <h5 style={{fontWeight: 500}}>Total:</h5>
                    </div>
                    <div className={s.sum}>
                        <h5>{this.props.currentCurrency} {this.totalPrice().tax}</h5>
                        <h5>{this.props.numberOrders} </h5>
                        <h5>{this.props.currentCurrency} {this.totalPrice().total} </h5>
                    </div>
                </div>
                <button>order</button>

            </div>
        )
    }
}


let mapStateToProps = (state) => {
    return{
        currentCurrency: state.header.currentCurrency,
        orders: state.cart.orders,
        numberOrders: state.cart.numberOrders,
        total: state.cart.total,
        tax: state.cart.tax
    }
}


export default compose(
    connect (mapStateToProps, {increaseQuantity, decreaseQuantity}),
    withRouter)
(Cart);
