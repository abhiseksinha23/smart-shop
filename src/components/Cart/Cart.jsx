import React from 'react';
import styles from './Cart.module.scss';

import { connect } from 'react-redux'

import { Link } from 'react-router-dom';
import { selectCartItems } from '../../redux/cart/cart.selectors';
import CartItem from '../CartItem/CartItem';

const Cart = ({ cartItems }) => {
    

    return (
        <div className={styles['cart']}>
            <div className={styles['title']}>
                <span>YOUR CART</span>
            </div>
            <div className={styles['container']}>
                {
                    cartItems.map(item => {

                        return (
                            <CartItem key={item._id} product={item}/>
                        );
                    })
                }
            </div>
            <div className={styles['footer']}>
                <Link to={'/checkout'} className={styles['checkout-btn']}>
                    CHECKOUT
                </Link>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    cartItems: selectCartItems(state),
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart);