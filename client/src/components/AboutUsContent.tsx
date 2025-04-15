import React from 'react';

const AboutUsContent = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Jam3a</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Jam3a is a revolutionary group buying platform designed to bring communities together through the power of collective purchasing. Our mission is to make quality products accessible to everyone by leveraging the strength of community buying.
        </p>
        <p className="mb-4">
          Founded in 2023, Jam3a emerged from a simple idea: when people come together, they can achieve more. We've built a platform that allows friends, neighbors, colleagues, and communities to combine their purchasing power and access better prices on everyday items and specialty products.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
        <p className="mb-4">
          We envision a world where communities are empowered through collaborative consumption, where quality products are accessible to all, and where the joy of shared experiences strengthens social bonds.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>Community First:</strong> We believe in the power of people coming together.</li>
          <li className="mb-2"><strong>Accessibility:</strong> Quality products should be available to everyone.</li>
          <li className="mb-2"><strong>Transparency:</strong> Clear communication and honest business practices guide everything we do.</li>
          <li className="mb-2"><strong>Innovation:</strong> We continuously improve our platform to better serve our communities.</li>
          <li className="mb-2"><strong>Sustainability:</strong> We promote responsible consumption and environmentally friendly practices.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4">How Jam3a Works</h2>
        <p className="mb-4">
          Our platform connects buyers with similar interests and purchase intentions. By aggregating demand, we negotiate better prices with suppliers and pass those savings directly to our users. The more people who join a purchase, the better the price becomes for everyone involved.
        </p>
        <p className="mb-4">
          Jam3a isn't just about saving money—it's about creating meaningful connections within communities and promoting a more collaborative approach to consumption.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Join Our Community</h2>
        <p className="mb-4">
          Whether you're looking to save on everyday essentials or find unique products at great prices, Jam3a welcomes you to our growing community of smart shoppers. Together, we're redefining the shopping experience and building stronger communities in the process.
        </p>
      </div>
    </div>
  );
};

export default AboutUsContent;
