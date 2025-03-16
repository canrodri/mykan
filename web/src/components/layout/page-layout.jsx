import PropTypes from "prop-types";

function PageLayout({ children }) {
  return (
    <div className="w-full h-full relative">{children}</div>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default PageLayout;
