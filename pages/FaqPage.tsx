import React from 'react';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <details className="group border-b border-gray-200 py-4">
    <summary className="flex items-center justify-between cursor-pointer list-none">
      <span className="font-medium text-gray-900">{question}</span>
      <span className="transition-transform duration-300 group-open:rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    </summary>
    <div className="mt-3 text-gray-600 prose">
      {children}
    </div>
  </details>
);

const FaqPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</h1>
      <div className="mt-8 space-y-4">
        <FaqItem question="What is schema.org?">
          <p>Schema.org is a collaborative, community activity with a mission to create, maintain, and promote schemas for structured data on the Internet, on web pages, in email messages, and beyond. It is sponsored by Google, Microsoft, Yahoo and Yandex. Using schema.org vocabulary can help search engines understand the information on web pages and provide richer search results.</p>
        </FaqItem>
        <FaqItem question="Why is a new property needed? Can't we use existing ones?">
          <p>While properties like <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm">branchOf</code> or using the <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm">description</code> field are possible workarounds, they are not specific enough. They don't explicitly and machine-readably state that a location is for display purposes only. This leads to ambiguity for search engines and potential confusion for customers. A dedicated <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm">displaylocation</code> property provides unambiguous, structured information.</p>
        </FaqItem>
        <FaqItem question="Who will benefit from this change?">
          <p>This change benefits several groups:</p>
          <ul>
            <li><strong>The Public</strong> who use search engines benefit directly. This change makes it easier to answer the question, "Where can I try this today?". It connects people with local showrooms and galleries, bridging the gap between online discovery and real-world experience.</li>
            <li><strong>Cultural Institutions</strong> like museums and art galleries can use it to specify where particular items are displayed, separate from storage facilities, archives, restoration or loan to other places.</li>
            <li><strong>Businesses</strong> with showrooms (e.g., furniture stores, car dealerships) can clarify that items are on display to be experienced.</li>
          </ul>
        </FaqItem>
        <FaqItem question="What is the process for getting a new property added to schema.org?">
          <p>The process involves community discussion and consensus-building. We have started by creating this proposal and gathering support from affected businesses. The next steps involve submitting the proposal to the schema.org community on GitHub, participating in discussions, and refining the proposal based on feedback. Strong support from the business community, as demonstrated by this petition, is crucial to showing the real-world need for the property.</p>
        </FaqItem>
        <FaqItem question="Who's behind this?">
          <p>DisplayLocation is a community project to standardize how “on display” inventory is marked up so people can find where to experience products in person.</p>
          <ul className="list-none p-0 m-0 space-y-2">
            <li>
              <strong>Steward:</strong> showroom.fm, a startup by Innsides Interiors UG (haftungsbeschränkt), Berlin, Germany. The start-up came into existence through the pain of trying to find where things could be experienced and the confirmation of stationary design furniture dealers who put their heart and soul into their showrooms, lacking an easy way to articulate this fact online.
            </li>
            <li>
              <strong>Contributors:</strong> consumers and visitors, business owners, manufacturers, independent agents, and members of the structured-data/search community.
            </li>
            <li>
              <strong>Funding:</strong> time, hosting, and coordination by showroom.fm; no fees to participate.
            </li>
            <li>
              <strong>Governance:</strong> proposals are developed in public (issues, drafts, reference implementations). Decisions and changes are documented and attributed.
            </li>
            <li>
              <strong>Contact:</strong> <a href="mailto:hello@displaylocation.org" className="text-brand hover:underline">hello@displaylocation.org</a> (press & participation)
            </li>
          </ul>
        </FaqItem>
        <FaqItem question="Who initiated the displayLocation proposal?">
          <p>
            The proposal was initiated by showroom.fm and submitted to schema.org as an open standard extension. While the initiative
            originated from work on showroom data, displayLocation is designed to be tool-agnostic and applicable to any industry where physical
            objects are exhibited or experienced in person.
          </p>
          <p>
            Background and timeline:{' '}
            <a
              href="https://blog.displaylocation.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand hover:underline"
            >
              https://blog.displaylocation.org
            </a>
          </p>
        </FaqItem>
        <FaqItem question="How can I help besides signing the petition?">
          <p>
            Sharing this website with other business owners or managers of cultural institutions in your network is a great way to help. If you're technically inclined, you can also join the discussion on the{' '}
            <a
              href="https://github.com/schemaorg/schemaorg/issues/4513"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              schema.org GitHub repository
            </a>
            . Your real-world use cases and examples can be very persuasive.
          </p>
        </FaqItem>
      </div>
    </div>
  );
};

export default FaqPage;
