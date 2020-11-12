//importing component and variable
import React, { Component } from "react";
import { globalVar } from "../config";
import thumbnail_1 from "../assets/img/product/thumbnail-1.jpg";
import thumbnail_2 from "../assets/img/product/thumbnail-2.jpg";
import thumbnail_3 from "../assets/img/product/thumbnail-3.jpg";
import thumbnail_4 from "../assets/img/product/thumbnail-4.jpg";
import thumbnail_5 from "../assets/img/product/thumbnail-5.jpg";
import thumbnail_6 from "../assets/img/product/thumbnail-6.jpg";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselCaption
} from "reactstrap";
import PropTypes from "prop-types";

//global variable
var items = [];
var base_url = globalVar.base_url;
const thumbnails = [
  {
    src: thumbnail_1,
    altText: "cabinet 1",
    caption: "Cabinets"
  },
  {
    src: thumbnail_2,
    altText: "thumbnail ",
    caption: "Doors"
  },
  {
    src: thumbnail_3,
    altText: "thumbnail",
    caption: "Floor & Wall Panels"
  },
  {
    src: thumbnail_4,
    altText: "thumbnail",
    caption: "Moulding"
  },
  {
    src: thumbnail_5,
    altText: "thumbnail",
    caption: "Windows"
  },
  {
    src: thumbnail_6,
    altText: "thumbnail",
    caption: "Wood Trusses"
  }
];

class SliderComponent1 extends Component {
  constructor(props) {
    super(props);
    //defining state variable
    this.state = { activeIndex: 6 };

    //binding function
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
  }

  /**
   * Moving to next slider
   */
  next() {
    const nextIndex =
      this.state.activeIndex === items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  /**
   * Moving to previous slider
   */
  previous() {
    const nextIndex =
      this.state.activeIndex === 0
        ? items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  /**
   * Selecting particular tab
   */
  goToIndex(newIndex) {
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    const items = this.props.item;
    const slides = items.map((item, i) => {
      return (
        <CarouselItem key={item.imageUrl + i}>
          <img
            src={
              item.imageTitle === "cabinetcustom"
                ? item.imageUrl
                : base_url + item.imageUrl
            }
            alt={item.imageTitle}
          />
        </CarouselItem>
      );
    });

    //looping through carousel items
    const slidesThumnails = thumbnails.map((capt, i) => {
      return (
        <CarouselItem key={capt.src + i + "d"}>
          <img src={capt.src} alt={capt.altText} />
          <CarouselCaption captionText={capt.caption} />
        </CarouselItem>
      );
    });

    return (
      <div>
        <div className="upper_slide">
          <Carousel
            activeIndex={activeIndex}
            next={this.next}
            previous={this.previous}
            interval={false}
          >
            {slides}
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={this.previous}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={this.next}
            />
          </Carousel>
        </div>

        <div className=" row pt-4 d-none d-md-flex">
          {items.map((slides, index) =>
            slides.imageTitle !== "cabinetcustom" ? (
              <div
                key={index}
                className={
                  "col-md-2 px-2 frame-box" +
                  (activeIndex === index ? "frame-selection" : "")
                }
              >
                <button type="button" onClick={() => this.goToIndex(index)}>
                  {slides.imageUrl ? (
                    <img
                      className="w-100 thumbimage"
                      src={base_url + slides.imageUrl}
                      alt="thumbnail_1"
                    />
                  ) : null}
                </button>
                <h5 className="font-weight-normal text-center pt-3 mt-auto">
                  {slides.imageTitle}
                </h5>
              </div>
            ) : null
          )}
        </div>
        <div className="mobile-slider d-block d-md-none m-auto">
          <Carousel
            activeIndex={activeIndex}
            next={this.next}
            previous={this.previous}
            interval={false}
          >
            {slidesThumnails}
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={this.previous}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={this.next}
            />
          </Carousel>
        </div>
      </div>
    );
  }
}

export default SliderComponent1;

/**
 * Define the proptypes
 */
SliderComponent1.propTypes = {
  item: PropTypes.array
};
