import React from "react";
import "./Product.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Product() {
  return (
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        {" "}
        <span class="textStyles">Hottest Deals</span>{" "}
        {/* <span class="custom-badge text-uppercase">See More</span>{" "} */}
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex flex-row align-items-center time">
                {" "}
                <i class="fa fa-clock-o"></i> <small class="ml-1">3 Days</small>{" "}
              </div>{" "}
              <img src="https://i.imgur.com/suuFVrQ.png" width="20" alt="" />
            </div>
            <div class="text-center">
              {" "}
              <img src="images/Classical Myth.jpg" alt="" height="250" width="250" />{" "}
            </div>
            <div class="text-center">
              <h5>Classical Myth</h5>{" "}
              <span class="text-success">$1.5 value</span>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex flex-row align-items-center time">
                {" "}
                <i class="fa fa-clock-o"></i>{" "}
                <small class="ml-1 text-primary">2 days</small>{" "}
              </div>{" "}
              <img src="https://i.imgur.com/suuFVrQ.png" width="20" alt="" />
            </div>
            <div class="text-center">
              {" "}
              <img src="images/Unbroken.jpg" alt="" height="250" width="250" />{" "}
            </div>
            <div class="text-center">
              <h5>Unbroken</h5>{" "}
              <span class="text-success">$1 value</span>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex flex-row align-items-center time">
                {" "}
                <i class="fa fa-clock-o"></i> <small class="ml-1">2 Days</small>{" "}
              </div>{" "}
              <img src="https://i.imgur.com/suuFVrQ.png" width="20" alt="" />
            </div>
            <div class="text-center">
              {" "}
              <img src="images/Its Kind of a Funny Story.jpg" alt="" height="250" width="250" />{" "}
            </div>
            <div class="text-center">
              <h5>Its Kind of a Funny Story</h5> <span class="text-success">$2 value</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
