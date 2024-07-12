import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import STRING_CONSTANTS from "../../constants";

export default function About({
    PRContract
}) {
    return (
        <Container fluid className="px-4 py-5 my-5 text-center">
            <h1 className="display-5 fw-bold">{STRING_CONSTANTS.PROJECT_NAME}</h1>
            <div className="col-lg-8 mx-auto">
            <p>
                Peer review in academia often relies on a “culture of service” as reviewers 
                contribute out of a sense of community obligation. There has been a continuous 
                increase in the number of papers submitted to journals for review. However, 
                there hasn’t been a corresponding rise in the number of interested reviewers. 
                This research attempts to identify the underlying reasons for this gap between 
                the number of qualified reviewers and papers submitted and propose solutions 
                to incentivize more qualified researchers to participate in the peer review 
                process.
            </p>

            <p>
            We conducted interviews with editors and reviewers to understand their motivation 
            for serving in the peer review process and the challenges they faced. Reviewers 
            primarily cited the opportunity to learn about new ongoing research and contribute 
            to the community as their primary motivation. Researchers at the beginning of their
             careers were also motivated to review as it is beneficial for their career 
             advancements. Many editors noted that a lot of researchers were more inclined 
             to submit their own work for review while not being willing to review papers 
             themselves. Editors have also faced issues with reviewers accepting the review 
             requests but failing to submit their reviews in a timely manner, or at all.
            </p>

            <p>
                Based on these findings, we’ve designed a blockchain-based peer review system 
                with an incentivization model to target the key motivating factors for 
                reviewers. As reviewers are highly motivated to review to advance the research 
                field, monetary rewards might not be the best approach. Instead, offering 
                recognition for their invaluable contributions could significantly enhance 
                participation rates. Additionally, for journals operating under a 
                subscription-based model, offering credits towards publication fees in exchange 
                for high-quality reviews could serve as a compelling incentive.
            </p>
            </div>
            
        </Container>
    );
}