import React from 'react';

const ImprintPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Imprint (Legal Notice) / Impressum</h1>
      <div className="mt-6 prose prose-lg text-gray-600 max-w-none">
        
        <p>displaylocation.org is an initiative by the team of showroom.fm.</p>
        <p>Showroom.fm is a service by</p>
        <p>
          <strong>Innsides Interiors UG (haftungsbeschränkt/limited liability company)</strong><br />
          Lübecker Straße 26<br />
          10559 Berlin<br />
          Germany
        </p>

        <p>
          <a href="mailto:hello@displaylocation.org" className="text-brand hover:underline">hello@displaylocation.org</a><br />
          +49 (0)30 22908290
        </p>

        <p>
          Entry in Commercial Register<br />
          Register Number HRB 155994 B<br />
          Register Court District Court, Charlottenburg<br />
          Represented by Vasco Sommer-Nunes and Anne-Marie den Hertog<br />
          VAT Registration Number is DE294126385.
        </p>
        
        <p>
          Persons responsible for content in accordance with 55 Abs. 2 RStV are Vasco Sommer-Nunes and Anne-Marie den Hertog.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8">DISCLAIMER</h2>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Accountability for content</h2>
        <p>
          The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents’ accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this context, please note that we are accordingly not obliged to monitor merely the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity. Our obligations to remove or block the use of information under generally applicable laws remain unaffected by this as per §§ 8 to 10 of the Telemedia Act (TMG).
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Accountability for links</h2>
        <p>
          Responsibility for the content of external links (to web pages of third parties) lies solely with the operators of the linked pages. No violations were evident to us at the time of linking. Should any legal infringement become known to us, we will remove the respective link immediately.
        </p>
      </div>
    </div>
  );
};

export default ImprintPage;
