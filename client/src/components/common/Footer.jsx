import React from "react";

function Footer() {
  return (
    <footer className="section bg-footer mt-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <div className="">
              <h6 className="footer-heading text-uppercase text-black">
                Explore
              </h6>
              <ul className="list-unstyled footer-link mt-4">
                <li><a href="">Latest Stories</a></li>
                <li><a href="">Top Authors</a></li>
                <li><a href="">Genres</a></li>
                <li><a href="">Community Picks</a></li>
              </ul>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="">
              <h6 className="footer-heading text-uppercase text-black">
                Resources
              </h6>
              <ul className="list-unstyled footer-link mt-4">
                <li><a href="">Writing Tips</a></li>
                <li><a href="">Story Guidelines</a></li>
                <li><a href="">Review Policy</a></li>
                <li><a href="">Help Center</a></li>
              </ul>
            </div>
          </div>

          <div className="col-sm-2">
            <div className="">
              <h6 className="footer-heading text-uppercase text-black">Account</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li><a href="">Sign Up</a></li>
                <li><a href="">Login</a></li>
                <li><a href="">Terms of Service</a></li>
                <li><a href="">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="">
              <h6 className="footer-heading text-uppercase text-black">
                Contact Us
              </h6>
              <p className="contact-info mt-4">Have a question? Reach out to us!</p>
              <p className="contact-info">Email: support@storyapp.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="footer-alt mb-0 f-14">2024 © StoryApp, All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
