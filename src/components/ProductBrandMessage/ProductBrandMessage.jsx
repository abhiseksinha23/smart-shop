import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductBrandMessage.module.scss';

import Axios from 'axios';

import { connect } from 'react-redux';
import { addMessage, popMessage } from '../../redux/messages/messages.actions';
import { setProductBrand } from '../../redux/products/products.actions';
import { selectProductType, selectProductCategory } from '../../redux/products/products.selectors';


import IsTyping from '../IsTyping/IsTyping';
import GoBackButton from '../GoBackButton/GoBackButton';

const ProductBrandMessage = ({ addMessage, setProductBrand, popMessage, productType, productCategory }) => {

    const [loading, setLoading] = useState(true);
    const [brandList, setBrandList] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {

        let subscribed = true;

        Axios
            .get(`https://smart-shop-api.herokuapp.com/${productType}/${productCategory}/brands`)
            .then(axiosRes => axiosRes.data)
            .then(apiRes => apiRes.data)
            .then(recivedData => {

                if (subscribed) {
                    setLoading(false);
                    setBrandList(recivedData);
                }

            })
            .catch(err => {
                console.error({ error: err });
            })

        return () => {
            subscribed = false;
        }

    }, [addMessage, setProductBrand, productCategory, productType]);



    const productBrandMessageRef = useRef(null);

    useEffect(() => {



        if (!loading) {
            productBrandMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }


    }, [loading]);


    const setBrandAndAddProductListMessage = (brandString) => {

        setProductBrand(brandString.toLowerCase());

        popMessage();

        addMessage({
            type: 'text',
            bot: false,
            content: brandString.toUpperCase(),

        });

        setTimeout(() => {

            addMessage({
                type: 'text',
                bot: true,
                content: `With so many great products to choose from, you'll be spoiled for choice ;)`,

            });

        }, 200)

        setTimeout(() => {

            addMessage({
                type: 'productList',
                bot: true,

            });

        }, 250);


    }


    const renderBrandList = (brandArray) => {

        return brandArray.map(brand => {
            return (
                <div key={brand} className={styles['brand']} onClick={() => { setBrandAndAddProductListMessage(brand) }}>
                    <span>{brand}</span>
                </div>
            );
        })
    }

    const handleSearch = (text) => {

        setSearch(text.toLowerCase());
    }

    return !loading ? (
        <div ref={productBrandMessageRef} className={styles['container']}>
            <div className={styles['search-div']}>
                <input
                    name="brandSearch"
                    type='text'
                    className={styles['search-box']}
                    placeholder='Search...'
                    onChange={(e) => { handleSearch(e.target.value) }}
                />
            </div>
            <div className={styles['brand-container']}>
                {
                    renderBrandList(brandList.filter(brand => (brand.toLowerCase().includes(search))))
                }
            </div>
            <div className={styles['footer']}>
                <GoBackButton goBackFrom={'brand'} />
                <GoBackButton restart />
            </div>
        </div>
    ) : (
            <IsTyping />
        );
}


const mapStateToProps = state => ({
    productType: selectProductType(state),
    productCategory: selectProductCategory(state),
});

const mapDispatchToProps = dispatch => ({
    addMessage: message => dispatch(addMessage(message)),
    popMessage: () => dispatch(popMessage()),
    setProductBrand: brand => dispatch(setProductBrand(brand)),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductBrandMessage);

