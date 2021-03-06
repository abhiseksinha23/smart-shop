import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductTypesMessage.module.scss';

import Axios from 'axios';

import { connect } from 'react-redux';
import { addMessage, popMessage } from '../../redux/messages/messages.actions';
import { setProductType } from '../../redux/products/products.actions';
// import { selectMessageList } from '../../redux/messages/messages.selectors';

import IsTyping from '../IsTyping/IsTyping';
// import ScrollThrough from '../ScrollThrough/ScrollThrough';

const ProductTypesMessage = ({ addMessage, setProductType, popMessage }) => {

    const [loading, setLoading] = useState(true);
    const [typeList, setTypeList] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {

        let isSubscribed = true;
        Axios
            .get(`https://smart-shop-api.herokuapp.com/types`)
            .then(axiosRes => axiosRes.data)
            .then(apiRes => apiRes.data)
            .then(recivedData => {
              if(isSubscribed){
                setLoading(false);
                setTypeList(recivedData);
              }

            })
            .catch(err => {
                console.error({ error: err });
            })

            return () => {
                isSubscribed = false;
            }

    }, [addMessage, setProductType]);



    const productTypeMessageRef = useRef(null);

    useEffect(() => {



        if (!loading) {
            productTypeMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }


    }, [loading]);


    const setTypeAndAddCategoriesMessage = (typeString) => {

        setProductType(typeString.toLowerCase());

        popMessage();

        addMessage({
            type: 'text',
            bot: false,
            content: typeString.toUpperCase(),

        });


        setTimeout(() => {

            addMessage({
                type: 'text',
                bot: true,
                content: 'Please choose a category.',

            });

        }, 200)

        setTimeout(() => {

            addMessage({
                type: 'categoryList',
                bot: true,

            });

        }, 250);
    }

    const renderTypeList = (typesArray) => {

        return typesArray.map(type => {
            return (
                <div key={type} className={styles['type']} onClick={() => { setTypeAndAddCategoriesMessage(type) }}>
                    <span>{type}</span>
                </div>
            );
        })
    }


    const handleSearch = (text) => {

        setSearch(text.toLowerCase());
    }


    return !loading ? (

        <div ref={productTypeMessageRef} className={styles['container']}>
            <div className={styles['search-div']}>
                <input
                    name="typeSearch"
                    type='text'
                    className={styles['search-box']}
                    placeholder='Search...'
                    onChange={(e) => { handleSearch(e.target.value) }}
                />
            </div>
            <div className={styles['types-container']} >
                {
                    renderTypeList(typeList.filter(type => type.toLowerCase().includes(search)))
                }
            </div>
        </div>

    ) : (
            <IsTyping />
        );
}

const mapStateToProps = state => ({
    // messageList: selectMessageList(state),
});

const mapDispatchToProps = dispatch => ({
    addMessage: message => dispatch(addMessage(message)),
    popMessage: () => dispatch(popMessage()),
    setProductType: type => dispatch(setProductType(type)),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductTypesMessage);
