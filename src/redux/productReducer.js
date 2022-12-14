import {GET_PRODUCT} from "../query/product";

const SET_PRODUCT = 'product/SET_PRODUCT';
const TOGGLE_IS_FETCHING = 'product/TOGGLE_IS_FETCHING';


let initialState = {
    isFetching: false,
    product: {
        id: null,
        name: null,
        inStock: false,
        description: null,
        category: null,
        brand: null,
        gallery: [],
        attributes: [],
        prices: [],
    }
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_PRODUCT: {
            return {
                ...state,
                product: {
                    id: action.payload.id,
                    name: action.payload.name,
                    inStock: action.payload.inStock,
                    description: action.payload.description,
                    category: action.payload.category,
                    brand: action.payload.brand,
                    gallery: action.payload.gallery,
                    attributes: action.payload.attributes.slice().sort((b,c) => c.type.charCodeAt(0) - b.type.charCodeAt(0)),
                    prices: action.payload.prices,
                    options: []
                }
            }
        }

        case TOGGLE_IS_FETCHING: {
            return {...state, isFetching: action.isFetching}
        }

        default: return state;
    }

}

export const setProduct = (payload) => ({type: SET_PRODUCT, payload});
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching});


export const getProduct = (productID) => async (dispatch) => {
    dispatch(toggleIsFetching(true));
    let payload = await GET_PRODUCT(productID);
    dispatch(setProduct(payload));
    dispatch(toggleIsFetching(false));
}

export default productReducer;


