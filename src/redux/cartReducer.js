
let ADD_ORDER = 'ADD_ORDER';
let INCREASE_QUANTITY = 'INCREASE_QUANTITY';
let DECREASE_QUANTITY = 'DECREASE_QUANTITY';
let IS_CART_OPEN = 'IS_CART_OPEN';


let initialState = {
    isCartOpen: false,
    numberOrders: 0,
    orders: [],
    total: 0,
    tax: 0
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case IS_CART_OPEN: {
            return {
                ...state,
                isCartOpen: !state.isCartOpen
            }
        }

        case ADD_ORDER: {

            if (action.payload.attributes.length !== action.options.length) {
                let difference = action.payload.attributes.filter(o1 => !action.options.some(o2 => o1.name === o2.name));
                difference.forEach((el) => action.options.push({name: el.name, id: el.items[0].id}))
            }

            let index = state.orders.findIndex(order => order.id === action.payload.id)
            if (index !== -1) {
                if (compareArray(state.orders[index].options, action.options)) {
                    state.orders[index].quantity++
                } else {
                    let order = {
                        id: action.payload.id,
                        name: action.payload.name,
                        brand: action.payload.brand,
                        gallery: action.payload.gallery,
                        prices: action.payload.prices,
                        attributes: action.payload.attributes,
                        options: action.options,
                        quantity: 1
                    }
                    state.orders.push(order)
                }
            }
            else {
                let order = {
                    id: action.payload.id,
                    name: action.payload.name,
                    brand: action.payload.brand,
                    gallery: action.payload.gallery,
                    prices: action.payload.prices,
                    attributes: action.payload.attributes,
                    options: action.options,
                    quantity: 1
                }

                state.orders.push(order)
            }


            return {
                ...state,
                numberOrders: state.numberOrders + 1
            }
        }



        case INCREASE_QUANTITY: {
            state.numberOrders++
            state.orders[action.payload].quantity++
            return {
                ...state
            }
        }

        case DECREASE_QUANTITY: {
            let quantity = state.orders[action.payload].quantity;
            if (quantity > 1) {
                state.numberOrders--
                state.orders[action.payload].quantity--
            } else {
                return {
                    ...state,
                    numberOrders: state.numberOrders - quantity,
                    orders: state.orders.filter(order => {
                        return order.id !== state.orders[action.payload].id
                        }

                    )
                }
            }
            return {
                ...state
            }
        }

        default:
            return state;

    }
}

export const checkCart = () => ({type: IS_CART_OPEN})
export const setProduct = (payload, options) => ({type: ADD_ORDER, payload, options})
export const increaseQuantity = (payload) => ({type: INCREASE_QUANTITY, payload})
export const decreaseQuantity = (payload) => ({type: DECREASE_QUANTITY, payload})


export const addProduct = (payload, options) => (dispatch) => {
    dispatch(setProduct(payload, options));
}

export const compareArray = (a, b) => {
    if (a.length !== b.length)
        return false
    a.sort((b,c) => b.name.charCodeAt(0) - c.name.charCodeAt(0))
    b.sort((b,c) => b.name.charCodeAt(0) - c.name.charCodeAt(0))
    for (let i = 0; i < a.length; i++) {
        if (a[i].name !== b[i].name) return false
        if (a[i].id !== b[i].id) return false
    }
    return true
}




export default cartReducer;
