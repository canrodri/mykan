import PropTypes from "prop-types";

function PageLayout({ children }) {
  return (
    <div className="w-full h-full absolute bg-white">{children}</div>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default PageLayout;
