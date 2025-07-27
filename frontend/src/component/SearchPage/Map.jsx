const Map = ({ location }) => (
  <iframe
    title="Venue Map"
    width="100%"
    height="600px"
    frameBorder="0"
    style={{ border: 0 }}
    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location || 'Phnom Penh'}`}
    allowFullScreen
  ></iframe>
);

export default Map;