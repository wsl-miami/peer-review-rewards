import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import bigLogo from '../../static/derpLogoBig.png';
import Container from 'react-bootstrap/Container';
import STRING_CONSTANTS from "../../constants";
// const oracledb = require('oracledb');


export default function AuthorDashboard({
    PRContract
}) {
    const [bounties, setBounties] = useState(null);
    useEffect(() => {
        console.log("here");
        if (PRContract) {
            console.log("then here");
            getBounties() 
                .then(data =>
                    setBounties(data)
                );
        }
    }, [PRContract]);

    const getBounties = async () => {
        const ret = (await PRContract.methods.allManuscripts().call());
        console.log('bounties', ret);
        return (ret);
    }

    const getTotalBounties = () => {
        var arr = [];
        if (bounties === null) {
          return arr;
        }
        for (let i = 0; i < bounties.length; i++) {
        // @TODO: Sort this out later
        //   arr[i] = new Date(bounties[i].gen_time * 1000).toLocaleDateString("en-US");
          arr[i] = new Date().toLocaleDateString("en-US");
        }
      
        var dateCounts = {};
        var runningTotal = 0;
      
        for (let i = 0; i < arr.length; i++) {
          const date = new Date(arr[i]).toISOString().slice(0, 10);
          const count = (dateCounts[date] || 0) + 1 + runningTotal;
          dateCounts[date] = count;
          runningTotal = count;
        }
      
        const result = Object.entries(dateCounts).map(([date, count]) => {
          return { date, count };
        });
      
        return result;
      }

    const getTotalTokens = () => {
        var arr = [];
        if (bounties === null) {
            return arr;
        }
        for (let i = 0; i < bounties.length; i++) {
            var temp = { "date": new Date(bounties[i].gen_time * 1000).toLocaleDateString("en-US"), "amount": bounties[i].amount };
            arr[i] = temp;
        }
        
        const dateAmounts = {};
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            const row = arr[i];
            const date = row.date;
            const amount = row.amount;
            sum += Number(amount);
            dateAmounts[date] = sum;
        }
        
        const result = Object.entries(dateAmounts).map(([date, amount]) => {
            return { date, amount };
        });
        
        return result;
    }
    const getCountOfReviews = () => {
        if (bounties === null) {
            return bounties;
        }
        var arr = [];
        for (let i = 0; i < bounties.length; i++) {
            arr[i] = { "date": new Date(bounties[i].gen_time * 1000).toLocaleDateString("en-US"), "passed": bounties[i].review_links.length };
        }
        
        var dateAmounts = {};
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            const row = arr[i];
            const date = row.date;
            const passed = row.passed;
            sum += Number(passed);
            dateAmounts[date] = sum;
        }
        
        const result = Object.entries(dateAmounts).map(([date, amount]) => {
            return { date, amount };
        });
        return result;
    }

    const DataFormater = (number) => {
        if(number > 1000000000){
          return (number/1000000000).toString() + 'B';
        }else if(number > 1000000){
          return (number/1000000).toString() + 'M';
        }else if(number > 1000){
          return (number/1000).toString() + 'K';
        }else{
          return number.toString();
        }
      }

    const config = { displayModeBar: false }
    return (
        <Container fluid className="px-4 py-5 text-center">
            <h1 className="display-5 fw-bold">{STRING_CONSTANTS.PROJECT_NAME}</h1>
            <div className="col-lg-8 mx-auto">
            <p className="lead mb-4">{STRING_CONSTANTS.PROJECT_NAME} introduces a flexible framework for journals to tailor review reward schemes to their unique criteria and review processes. This platform acknowledges that different journals can have different review methodologies and incentive preferences, offering them the freedom to decide upon the most appropriate reward mechanism.</p>
            </div>
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
            {/* <Row className='align-items-center'>
                <Col md={{ span: 4, offset: 2 }}>
                    <h4>{rewards_text}</h4>
                </Col>
                <Col className="text-center" md={{ span: 4 }}>
                    <h2>Tokens Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            width={500}
                            height={300}
                            data={getTotalTokens()}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={DataFormater}/>
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row> */}
            {/* <Row className="align-items-center">
                <Col className="text-center" fluid="true" md={{ span: 4, offset: 2 }}>
                    <h2>Total Articles</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            width={500}
                            height={300}
                            data={getTotalBounties()}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
                <Col md={{ span: 4 }}>
                    <h3>Team Members:</h3>
                    <h4>{team_members_and_citations}</h4>
                </Col>
            </Row> */}
            {/* <Row className='text-center'>
                <Col fluid="true" md={{ span: 4, offset: 2 }}>
                    <h3>Our Inspiration</h3>
                    <ul>
                        <li>
                            <a
                                target="_blank"
                                href="https://aisel.aisnet.org/cais/vol42/iss1/28/"
                            >
                                Peer Review: Toward a Blockchain-enabled Market-based Ecosystem
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/f67443e9-96d2-40e7-8675-aff625526c7b/content"
                            >
                                Towards a Decentralized Process for Scientific Publication and Peer Review using Blockchain and IPFS
                            </a>
                        </li>
                    </ul>
                </Col>
                <Col className="text-center" fluid="true" md={{ span: 4 }}>
                    <h2>Total Reviews</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            width={500}
                            height={300}
                            data={getCountOfReviews()}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row> */}
        </Container>
    );
}