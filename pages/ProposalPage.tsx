import React from 'react';

const ProposalPage: React.FC = () => {
  const codeSnippet = `
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Modern Designs",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Design Avenue",
    "addressLocality": "Metropolis",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "displaylocation": {
    "@type": "Place",
    "name": "Downtown Showroom",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "456 Showroom Street",
      "addressLocality": "Metropolis",
      "postalCode": "10002",
      "addressCountry": "US"
    },
    "description": "Visit our showroom to see our products. No on-site sales or pickup."
  }
}
  `;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The "displaylocation" Proposal</h1>
      <div className="mt-6 prose prose-lg text-gray-600 max-w-none">
        <p>
          The current schema.org vocabulary lacks a specific property to designate a location as a showroom or display-only facility. This ambiguity affects a wide range of organizations, from retail businesses (furniture stores, car dealerships) to cultural institutions (museums, art galleries) that maintain special locations to display items. These items may not be for sale, may be part of a collection housed elsewhere, or may be available only by custom order.
        </p>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg not-prose">
          <p className="text-sm text-blue-800">
            This proposal has been formally submitted for community discussion. You can follow and participate in the official conversation on the schema.org GitHub repository:
          </p>
          <a
            href="https://github.com/schemaorg/schemaorg/issues/4513"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:underline break-all"
          >
            https://github.com/schemaorg/schemaorg/issues/4513
          </a>
<br /><br />
<p className="text-sm text-blue-800">
            Our initial blog post can be found here:
          </p>
          <a
            href="https://blog.showroom.fm/index.php/2025/09/26/113/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:underline break-all"
          >
            https://blog.showroom.fm/index.php/2025/09/26/113/
          </a>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Why Existing Tags Fall Short</h2>
        <p>
          Current Schema.org tools (e.g., <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">InStock</code> or <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">InStoreOnly</code> under <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">Offer</code>) are great for signaling basic availability, but they fall short on the experiential side. Customers aren't just buying; they're seeking sensory engagement—feeling the fabric, testing the ergonomics, or admiring an artwork up close. Without explicit markup for display status or location, search engines can't reliably surface that info, forcing users to call stores or guess based on blurry photos.
        </p>
        <p>
          A dedicated property would:
        </p>
        <ul>
          <li><strong>Enhance Discoverability:</strong> Enable rich results like "Try this couch at our downtown showroom—open now!" in Google or Bing.</li>
          <li><strong>Support AI and Voice Search:</strong> Assistants like Siri or Grok could answer "Where can I experience the real thing?" with location-specific responses.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Proposed Solution</h2>
        <p>
          We propose the creation of a new property, <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">displaylocation</code>. This property would be applicable to types such as <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">Store</code>, <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">LocalBusiness</code>, <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">Museum</code>, and their subtypes.
        </p>
        <ul>
          <li><strong>Property Name:</strong> <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">displaylocation</code></li>
          <li><strong>Expected Type:</strong> <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">Place</code></li>
          <li><strong>Description:</strong> "A physical location where items are displayed. This may be for viewing and demonstration (like a showroom), or as part of an exhibition (like a gallery). This is distinct from a location where items are typically available for immediate purchase, pickup, or as part of a permanent collection."</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Example Implementation (JSON-LD)</h2>
        <p>Here is an example of how a furniture store could use the new property to mark its downtown showroom:</p>
        <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto text-sm">
          <code className="language-json">{codeSnippet.trim()}</code>
        </pre>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Benefits</h2>
        <p>
          Implementing this property will provide significant benefits to businesses, institutions, and the public:
        </p>
        <ul>
            <li><strong>Answering "Where can I try this?":</strong> Directly enables search engines to connect customers who are ready to see a product in person with the correct physical location, bridging the digital-to-physical gap.</li>
            <li><strong>Clarity for Customers & Visitors:</strong> Prevent confusion by clearly marking a location as a showroom or gallery, ensuring visitors arrive with the correct expectations (e.g., not for immediate purchase or pickup).</li>
            <li><strong>Improved Data Accuracy:</strong> Allows businesses and institutions to provide more precise, machine-readable data to search engines, leading to better-quality search results.</li>
            <li><strong>Better Representation:</strong> Gives both commercial and cultural entities a standardized way to represent important display-only locations, reflecting modern retail and exhibition practices.</li>
        </ul>
        <p>
          We believe this addition is a logical and necessary extension of the schema.org vocabulary to reflect modern retail and cultural realities.
        </p>
        <p className="font-semibold text-gray-800 mt-4">
          Let's make data explicit, machine-readable, and user-centric.
        </p>
      </div>
    </div>
  );
};

export default ProposalPage;
