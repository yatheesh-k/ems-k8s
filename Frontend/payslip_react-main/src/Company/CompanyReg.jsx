import React from "react";

const CompanyReg = () => {

  return (
    <div className="col-12 col-lg-6">
      <div className="tab">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link"
              href="#tab-1"
              data-bs-toggle="tab"
              role="tab"
              aria-selected="false"
              tabIndex={-1}
            >
              Home
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link"
              href="#tab-2"
              data-bs-toggle="tab"
              role="tab"
              aria-selected="false"
              tabIndex={-1}
            >
              Profile
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link active"
              href="#tab-3"
              data-bs-toggle="tab"
              role="tab"
              aria-selected="true"
            >
              Messages
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane" id="tab-1" role="tabpanel">
            <h4 className="tab-title">Default tabs</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor tellus eget condimentum rhoncus. Aenean
              massa. Cum sociis natoque penatibus et magnis neque dis parturient
              montes, nascetur ridiculus mus.
            </p>
            <p>
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo.
            </p>
          </div>
          <div className="tab-pane" id="tab-2" role="tabpanel">
            <h4 className="tab-title">Another one</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor tellus eget condimentum rhoncus. Aenean
              massa. Cum sociis natoque penatibus et magnis neque dis parturient
              montes, nascetur ridiculus mus.
            </p>
            <p>
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo.
            </p>
          </div>
          <div className="tab-pane active show" id="tab-3" role="tabpanel">
            <h4 className="tab-title">One more</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor tellus eget condimentum rhoncus. Aenean
              massa. Cum sociis natoque penatibus et magnis neque dis parturient
              montes, nascetur ridiculus mus.
            </p>
            <p>
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyReg;
