import React, { Fragment, useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import Carousel from 'react-material-ui-carousel';
import './ProductDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearErrors,
  getProductDetails,
  newReview,
} from '../../actions/productAction';
import ReviewCard from './ReviewCard.js';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { addItemsToCart } from '../../actions/cartAction';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
// import { Modal } from 'react-bootstrap';

const { RangePicker } = DatePicker;

const ProductDetails = ({ match, history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { cartItems } = useSelector((state) => state.cart);

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const options = {
    size: 'large',
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  const checkoutHandler = async () => {
    await dispatch(
      addItemsToCart(match.params.id, quantity, totalPaisa, from, to)
    );

    history.push('/login?redirect=shipping');
  };
  const [datesSelected, setDatesSelected] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  //i dont know why the below line was giving errors when placed at some other line: Calendar code too
  const [totalDays, setTotalDays] = useState(0);
  const [totalPaisa, setTotalPaisa] = useState(0);
  // const [fromm, fromDate] = useState(0);

  // const [tooo, toDate] = useState(0);
  // const [showModal, setShowModal] = useState(false);

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set('rating', rating);
    myForm.set('comment', comment);
    myForm.set('productId', match.params.id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success('Review Submitted Successfully');
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert, reviewError, success]);

  //calendar code here too, calculation of days*price

  useEffect(() => {
    setTotalPaisa(totalDays * product.price);
  }, [totalDays, product.price]);

  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  function selectTimeSlots(values) {
    if (values !== null) {
      setFrom(moment(new Date(values[0])).format('MMM DD YYYY'));
      setTo(moment(new Date(values[1])).format('MMM DD YYYY'));
      console.log(values);
      // console.log(typeof values[0]);
      // console.log(typeof values[1]);
      console.log(values[0].toString());
      console.log(values[1].toString());
      // console.log(values[0]);
      // console.log(values[1]);

      // console.log(moment(values[0]).format('YYYY-MM-DD'));

      // console.log(moment(values[1]).format('YYYY-MM-DD'));
      // *******************THE ONE BELOW IS WHAT WORKS!!!!!!!!!!**********************************************
      // console.log(moment(new Date(values[0])).format('MMM DD YYYY'));
      // console.log(moment(new Date(values[1])).format('MMM DD YYYY'));
      // console.log(moment(values[0]));
      // console.log(moment(values[1]));
      // console.log(moment(values[0]).format('MMM Do YY'));
      // console.log(moment(values[1]).format('MMM Do YY'));

      // const fromDate = () => {
      //   moment(values[0]).format('MMM DD YYYY');
      // };
      // const toDate = () => {
      //   moment(values[1]).format('MMM DD YYYY');
      // };

      setTotalDays(values[1].diff(values[0], 'days'));
      setDatesSelected(true);
    } else {
      setDatesSelected(false);
    }
  }
  const addToCartHandler = () => {
    dispatch(addItemsToCart(match.params.id, quantity, totalPaisa, from, to));
    alert.success('Item Added To Cart');
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {' '}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <p>
                  Rent Per Day:<b>{product.price}</b>
                </p>
              </div>
              <div className="detailsBlock-3">
                {/* <h1>{`₹${product.price}`}</h1> */}
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={
                      product.Stock < 1 || !datesSelected ? true : false
                    }
                    onClick={checkoutHandler}
                  >
                    {/* should I change this to direct buy instead */}
                    Book Now
                  </button>
                </div>
                {/* Could be removed saying admin himself has to delete product once it is rented out */}
                {/* <button
                  classname="seebookedslots"
                  onClick={() => setShowModal(true)}
                >
                  See Booked Slots
                </button> */}

                {/* Calendar code */}

                <div classname="detailsBlock-3">
                  <b>Select Time Slots</b>
                  <div classname="detailsBlock-3-1">
                    <b>
                      <RangePicker
                        format="YYYY-MM-DD"
                        onChange={selectTimeSlots}
                      />
                      <div className="detailsBlock-3-1-1">
                        <span>
                          <p>Total Days : {totalDays}</p>
                        </span>

                        <div className="detailsBlock-3-1-1">
                          <h3>Total Amount : {totalPaisa}</h3>
                        </div>
                      </div>
                    </b>
                  </div>
                </div>
                <p>
                  Status:
                  <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>
                    {product.Stock < 1 ? 'OutOfStock' : 'InStock'}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
      {/* <Modal visible={showModal} closable={false} footer={false}>
        {product && (
          <div className="p">
            {product.bookedTimeSlots.map((slot) => {
              return (
                <button className="btn1 mt-2">
                  {slot.from} - {slot.to}
                </button>
              );
            })}
          </div>
        )}
      </Modal> */}
    </Fragment>
  );
};

export default ProductDetails;
