import React, { Component } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component{
  state = {
    purchasing: false
  }

  componentDidMount () {
    this.props.onInitIngredients();
  }

  purchaseHandler = () => {
    if (this.props.isAuthenitcated) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push('/auth');
    }
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map( (igKey) => {
        return ingredients[igKey];
      } )
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
      return sum > 0;
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  }

  purchasContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    };
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredient can't be loaded</p> : <Spinner />
    if (this.props.ings){
      burger = (
        <>
          <Burger ingredients={this.props.ings}/>
          <BuildControls 
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            isAuth={this.props.isAuthenitcated}
            purchase={this.purchaseHandler}
            />
        </>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseContinue={this.purchasContinueHandler}
          purchaseCancelled={this.purchaseCancelHandler}
          totalPrice={this.props.price} />
      );
    }
    
    return (
      <>
        {burger}
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenitcated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler( BurgerBuilder, axios ));